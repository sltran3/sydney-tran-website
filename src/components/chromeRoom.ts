import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// the same RoomEnvironment the logo used, with a soft blush floor.
// the white halo on the pink sky was the letters' bottom edges reflecting the room's bright white floor;
// a tinted floor removes it, and the rest of the room stays white so the chrome stays silver.
// default floor is a paler blush than the original suggestion (#dccbd3) so the chrome stays light.
export function makeChromeRoom(floorColor = 0xeee3e8) {
  const room = new RoomEnvironment();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: floorColor }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.9; // just above the room's own floor
  room.add(floor);

  return room;
}
