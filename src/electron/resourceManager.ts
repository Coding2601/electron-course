import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os';
import { ipcWebContentSend } from './util.js';

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: Electron.BrowserWindow) {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = await getRamUsage();
        const storageUsage = await getStorageUsage();
        ipcWebContentSend('statistics', mainWindow.webContents, { cpuUsage, ramUsage, storageUsage: storageUsage.used });
        console.log({ cpuUsage, ramUsage, storageUsage: storageUsage.used });
    }, POLLING_INTERVAL);
}

export function getStaticData() {
    const totalStorage = getStorageUsage().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemInGB = Math.floor(os.totalmem() / 1_000_000_000);
    return { totalStorage, cpuModel, totalMemInGB };
}

function getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
        osUtils.cpuUsage(resolve);
    });
}

function getRamUsage() {
    return (1 - osUtils.freememPercentage()) * 100;
}

function getStorageUsage() {
    const stats = fs.statfsSync('C://');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;
    return {
        total: Math.floor(total / 1_000_000_000),
        used: (1 - free/total) * 100
    };
}