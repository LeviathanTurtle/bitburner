/** @param {NS} ns */
export async function main(ns) {
    // read contents of the server list file
    const fileContents = ns.read('servers.txt');
    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    //ns.tprint(servers);


    //for (let i = 0; i < servers.length; ++i) {
    for (const serv of servers) {
      // these are in if statements to avoid deleting files
      // that aren't actually there
      if (ns.fileExists("weaken-template.js",serv/*ers[i]*/)) {
        ns.tprint(`Deleting weaken-template.js from ${serv/*ers[i]*/}`);
        ns.rm("weaken-template.js",serv/*ers[i]*/);
        //await ns.sleep(250);
      }

      if (ns.fileExists("grow-template.js",serv/*ers[i]*/)) {
        ns.tprint(`Deleting grow-template.js from ${serv/*ers[i]*/}`);
        ns.rm("grow-template.js.js",serv/*ers[i]*/);
        //await ns.sleep(250);
      }

      if (ns.fileExists("hack-template.js",serv/*ers[i]*/)) {
        ns.tprint(`Deleting hack-template.js from ${serv/*ers[i]*/}`);
        ns.rm("hack-template.js.js",serv/*ers[i]*/);
        //await ns.sleep(250);
      }
    }
    ns.tprint("DONE -- deleting scripts");
}