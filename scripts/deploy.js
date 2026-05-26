#!/usr/bin/env node
/**
 * SFTP deploy script — uploads the web/ directory to the remote demo server.
 *
 * Configuration (in .env.production):
 *   SFTP_HOST         Remote host            (e.g. ssh.cluster110.hosting.ovh.net)
 *   SFTP_PORT         SSH port               (default: 22)
 *   SFTP_USER         SSH user
 *   SFTP_REMOTE_PATH  Base remote path       (e.g. /www/demo  — no trailing slash, no ~)
 *   SFTP_PRIVATE_KEY  Path to private key    (optional — skips password prompt if set)
 *   SFTP_DEBUG        Set to "true" for verbose output
 *
 * The target directory is built as: SFTP_REMOTE_PATH/map{major} (e.g. /www/demo/map13)
 * The version is read automatically from package.json.
 * The password is always prompted interactively unless SFTP_PRIVATE_KEY is set.
 *
 * Usage:
 *   npm run deploy
 *   SFTP_DEBUG=true npm run deploy
 */

const fs         = require('fs');
const path       = require('path');
const { execSync } = require('child_process');
const SftpClient = require('ssh2-sftp-client');

const ROOT    = path.resolve(__dirname, '..');
const pkg     = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const MAJOR   = pkg.version.split('.')[0];
const MAP_DIR = `map${MAJOR}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

let debugMode = false;

function log(msg)       { console.log(`  ${msg}`); }
function debug(msg)     { if (debugMode) console.log(`  [debug] ${msg}`); }
function logOk(msg)     { console.log(`✓ ${msg}`); }
function logError(msg)  { console.error(`✗ ${msg}`); }

function readEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return fs.readFileSync(filePath, 'utf8').split('\n').reduce((acc, line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) acc[m[1].trim()] = m[2].trim().replace(/^['"](.*)['"]$/, '$1');
        return acc;
    }, {});
}

function promptPassword(label) {
    return new Promise((resolve) => {
        process.stdout.write(label);
        let password = '';

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        const onData = (char) => {
            if (char === '\r' || char === '\n') {
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener('data', onData);
                process.stdout.write('\n');
                resolve(password);
            } else if (char === '') {  // Ctrl+C
                process.stdout.write('\n');
                process.exit();
            } else if (char === '') {  // Backspace
                password = password.slice(0, -1);
            } else {
                password += char;
            }
        };

        process.stdin.on('data', onData);
    });
}

function countLocalFiles(dir) {
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        count += entry.isDirectory() ? countLocalFiles(full) : 1;
    }
    return count;
}

// ── Config ────────────────────────────────────────────────────────────────────

async function getConfig() {
    const env = {
        ...readEnvFile(path.join(ROOT, '.env.demo')),
        ...process.env,
    };

    debugMode = env.SFTP_DEBUG === 'true';

    const required = ['SFTP_HOST', 'SFTP_USER', 'SFTP_REMOTE_PATH'];
    const missing  = required.filter(k => !env[k]);
    if (missing.length) {
        logError(`Missing required variables in .env.demo: ${missing.join(', ')}`);
        process.exit(1);
    }

    if (env.SFTP_REMOTE_PATH.startsWith('~')) {
        logError('SFTP_REMOTE_PATH cannot start with ~ (tilde is not expanded over SFTP).');
        logError('Use an absolute path, e.g. /home/cataluny/www/demo');
        process.exit(1);
    }

    const connConfig = {
        host:     env.SFTP_HOST,
        port:     parseInt(env.SFTP_PORT || '22', 10),
        username: env.SFTP_USER,
    };

    if (env.SFTP_PRIVATE_KEY) {
        connConfig.privateKey = fs.readFileSync(env.SFTP_PRIVATE_KEY);
        debug(`Using private key: ${env.SFTP_PRIVATE_KEY}`);
    } else {
        connConfig.password = await promptPassword(`Password for ${env.SFTP_USER}@${env.SFTP_HOST}: `);
    }

    const remotePath = `${env.SFTP_REMOTE_PATH}/${MAP_DIR}`;
    return { connConfig, remotePath };
}

// ── Deploy ────────────────────────────────────────────────────────────────────

async function deploy() {
    console.log(`\nDeploy — catalunya-map v${pkg.version}`);
    console.log('─'.repeat(45));

    const { connConfig, remotePath } = await getConfig();
    const localPath = path.join(ROOT, 'web');

    const totalFiles = countLocalFiles(localPath);
    log(`Local path  : ${localPath} (${totalFiles} files)`);
    log(`Remote path : ${connConfig.host}:${remotePath}`);
    console.log('');

    log('Building with .env.demo configuration...');
    try {
        execSync('npm run buildDemo', { cwd: ROOT, stdio: 'inherit' });
        logOk('Build complete');
    } catch (err) {
        logError(`Build failed: ${err.message}`);
        process.exit(1);
    }
    console.log('');

    const sftp = new SftpClient();

    if (debugMode) {
        sftp.on('upload', (info) => log(`uploaded: ${info.source}`));
        sftp.on('error',  (err)  => logError(`sftp error: ${err.message}`));
    }

    log(`Connecting to ${connConfig.host}:${connConfig.port}...`);
    try {
        await sftp.connect(connConfig);
    } catch (err) {
        logError(`Connection failed: ${err.message}`);
        process.exit(1);
    }
    logOk('Connected');

    log(`Creating remote directory...`);
    try {
        await sftp.mkdir(remotePath, true);
        logOk(`Remote directory ready: ${remotePath}`);
    } catch (err) {
        logError(`mkdir failed: ${err.message}`);
        await sftp.end();
        process.exit(1);
    }

    log(`Uploading ${totalFiles} files...`);
    let uploaded = 0;
    sftp.on('upload', () => {
        uploaded++;
        if (!debugMode) process.stdout.write(`\r  ${uploaded}/${totalFiles} files uploaded`);
    });

    try {
        await sftp.uploadDir(localPath, remotePath, {});
    } catch (err) {
        logError(`\nUpload failed: ${err.message}`);
        await sftp.end();
        process.exit(1);
    }

    process.stdout.write('\n');
    logOk(`Deploy complete — ${uploaded} files uploaded to ${remotePath}`);

    await sftp.end();
    console.log('');
}

deploy().catch(err => {
    logError(`Unexpected error: ${err.message}`);
    if (debugMode) console.error(err);
    process.exit(1);
});
