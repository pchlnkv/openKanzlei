const { spawn, execSync } = require("child_process");
const path = require("path");
const os = require("os");
const chalk = require("chalk");
const isWindows = os.platform() === "win32";

const timeStart = Date.now();

const javaInstalled = () => {
    try {
        execSync("java -version", { stdio: "ignore"});
        return true;
    } catch {
        return false;
    }
}

function run(cmd, args, name){
    const proc = spawn(cmd, args, {
        stdio: "inherit",
        shell: true
    });

    proc.on("exit", (code) => {
        if(code !== 0){
            console.error(`${name} wurde mit Code ${code} beendet`);
            process.exit(code);
        }
    });

    return proc;
}

const prefix = "[openKanzlei]";
const log = (...args) => {
    console.log(chalk.bgBlue.white(prefix), ...args)
}

const startFlowable = () => {
    const binPath = path.join(__dirname, "./flowable/tomcat/bin");
    log(`Tomcat binPath: ${binPath}`)
    const cmd = isWindows ? "catalina.bat" : "./catalina.sh";
    const tomcat = spawn(cmd, ["run"], {
        cwd: binPath,
        stdio: "inherit",
        shell: isWindows
    });

    tomcat.on("exit", (code) => {
    if (code !== 0){
        console.error(`${prefix} Tomcat (Flowable) wurde mit Code ${code} beendet`);
        process.exit(code);
    }
    });

    log("Warte auf Flowable Server...");
    execSync(`npx wait-on http://localhost:8080`, {stdio: "inherit"});
    log("Flowable online");
    return tomcat;
}

function main() {
    //Prüfen, ob Java installiert ist
    if(!javaInstalled) {
        console.error("Java-Installation fehlt. Bitte JDK 17+ installieren!")
        process.exit(1);
    }

    log("Starte openKanzlei...");
    log("Starte Flowable...");
    log(`Windows: ${isWindows}`)
    startFlowable();
    log("Starte openKanzlei API...");
    run("npm", ["start", "--prefix", "backend"], "backend");
    execSync(`npx wait-on http://localhost:3001`, {stdio: "inherit"});
    log("Starte openKanzlei Benutzeroberfläche...");
    run("npm", ["start", "--prefix", "frontend"], "frontend");
    execSync(`npx wait-on http://localhost:3000`, {stdio: "inherit"});

    const time = (Date.now() - timeStart) / 1000;
    log(`Gestartet in ${time.toFixed(1)}s`);
}

main();