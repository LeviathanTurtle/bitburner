/** @param {NS} ns */
export async function main(ns) {
  // read contents of the server list file
  const fileContents = ns.read('servers.txt');

  // split the file contents into lines
  const servers = fileContents
      .split('\n') // split up each line
      .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
      .filter(line => line.length > 0); // remove empty lines
  ns.printf("Servers: %s", servers)


  for (const serv of servers) {
    switch (serv) {
      case "home":
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
          ns.print("All scripts except master.js killed.");
        } else {
          ns.print("master.js is not running on the server.");
        }

        break;

      default:
        ns.killall(serv);
    }
  }

  ns.print("DONE -- stopping scripts");
}

