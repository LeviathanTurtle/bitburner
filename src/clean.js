/** @param {NS} ns */
export async function main(ns) {
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];

    // read contents of the server list file
    const fileContents = ns.read('servers.txt');
    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    ns.printf("Servers: %s", servers)


    for (const serv of servers) {
        for (const file of files) {
            // this is in an if statement to avoid deleting files
            // that aren't actually there
            if (ns.fileExists(file,serv)) {
                ns.printf("Deleting %s from %s", file, serv);
                ns.rm(file,serv);
                //await ns.sleep(250);
            }
        }
    }

    ns.print("DONE -- deleting scripts");
}