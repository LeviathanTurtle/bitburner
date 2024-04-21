/** @param {NS} ns */
export async function main(ns) {
  // ram req: 
  ns.exec("kill.js","home");
  await ns.sleep(1000);


  // ram req: 
  ns.exec("clean.js","home");
  await ns.sleep(1000);


  // ram req: 
  ns.exec("script_startup.js","home");
  //let affected_servers = ns.exec("script_startup.js","home");
  await ns.sleep(1000);
  

  // while script_startup.js is running, sleep


  // ram req:
  //ns.exec(`home-script_startup.js ${affected_servers}`,"home");
  //ns.run(`home-script_startup.js ${affected_servers}`);
  //await ns.sleep(1000);
  // THE PROBLEM: this is executed 1s after script_startup (due to sleep)
}