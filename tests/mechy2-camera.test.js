import test from 'node:test';import assert from 'node:assert/strict';
import {createView,rotateView,moveRelative,cameraPosition} from '../mechy2-camera.js';
test('third-person view stays behind and below an overhead angle',()=>{const view=createView(Math.PI),position=cameraPosition({x:0,z:0},view);assert.ok(position.y<6&&position.z>7);rotateView(view,100,9999);assert.ok(view.pitch<=.65);rotateView(view,0,-9999);assert.ok(view.pitch>=.08);});
test('forward movement follows the camera heading while preserving input strength',()=>{const v=moveRelative(0,-1,Math.PI/2);assert.ok(Math.abs(v.x-1)<1e-8&&Math.abs(v.z)<1e-8);for(const yaw of [0,1,2]){const p=moveRelative(.3,-.4,yaw);assert.ok(Math.abs(Math.hypot(p.x,p.z)-.5)<1e-8);}});
