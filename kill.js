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
      switch (serv/*ers[i]*/) {
        case "home":
          //const master = ns.getRunningScript("master.js","home");
          //if (!master) {
          //  ns.killall(servers[i]);
          //}
          //ns.scriptKill("script_startup.js","home");

          //for (let j = 0; j < servers.length; ++j) {
          //  ns.scriptKill(`weaken-template.js ["${servers[j]}"]`);
          //  ns.scriptKill("hack-template.js");
          //  ns.scriptKill("grow-template.js");
          //}

          const scripts = ns.ps("home");

          // Find the script started by one of the main scripts
          const startupScript_1 = scripts.find(script => script.filename === "master.js");
          const startupScript_2 = scripts.find(script => script.filename === "kill.js");

          if (startupScript_1 || startupScript_2) {
            // Kill all other scripts except the one started by "run master.js"
            for (const script of scripts) {
              if (script.pid !== startupScript_1.pid || script.pid !== startupScript_2.pid) {
                ns.kill(script.pid);
                //await ns.sleep(250);
              }
            }
            ns.tprint("All scripts except master.js killed.");
          } else {
            ns.tprint("master.js is not running on the server.");
          }

          break;

        default:
          ns.killall(serv/*ers[i]*/);
      }
    }

    ns.tprint("DONE -- stopping scripts");
}

