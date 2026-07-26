import  cpus  from "./data/CPU";
import { motherboards } from "./data/MOTHERBOARD";


export function CompatibilityChecker () {

  //Map creates a new array based on the return values
  const socketCheck = cpus.map(({ id, socket, name }, index) => {
    //destrucuring the source items wih a safety fallback 
    const { name: NAME, socket: socketType } = motherboards[index] || {};

    if (!socket) {
      return(`Error: no matching slot found ${name}`)
    }

    //Compatibility logic
    const socketMatches = socket === socketType;
    
    return {
      id,
      isCompatible: socketMatches,
      failures: [
        (!socketMatches ? "Connector Mismatch" : null)
      ].filter(Boolean)
      
    }
  })
  const CompatibleOnly = socketCheck.filter(result => result.isCompatible)

  console.log(CompatibleOnly);
  
  // //looping through the first array
  // for (const [index, { name, socket }] of cpus.entries()) {

  //   //Destructuring the second array 
  //   const { name: NAME, socket: socketType } = motherboards[index] || {};

  //   //safety check
  //   if (!socket) {
  //     console.log(`Error: no matching slot found ${name}`)
  //     continue;
  //   }

  //   //Run compatibility check
  //   const socketMatches = socket === socketType;

  //   // Output results
  //   if (socketMatches) {
  //     console.log(`${socketType}${NAME} is COMPATIBLE with ${name}`)
  //   } else {
  //     console.log(`INCOMPATIBLE pairing ${name}: with ${socket}${NAME}`)
  //   }
  // }
}




