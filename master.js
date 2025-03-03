/** @param {NS} ns */
export async function main(ns) {
  // ram req: 
  ns.exec("kill.js","home");
  await ns.sleep(1000);


  // ram req: 
  ns.exec("clean.js","home");
  await ns.sleep(1000);


  // ram req: 
  const scriptPID1 = ns.exec("script_startup.js","home");
  while (ns.isRunning(scriptPID1, "home", "script_startup.js")) {
    await ns.sleep(1000);
  }


  // ram req:
  const scriptPID2 = ns.exec("home-script_startup.js","home");
  while (ns.isRunning(scriptPID2, "home", "home-script_startup.js")) {
    await ns.sleep(1000);
  }


  // ram req: 
  //ns.exec("purchase-server-template.js","home");
  //...
}