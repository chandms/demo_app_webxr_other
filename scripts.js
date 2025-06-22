/** Initial Variables **/
/* global AFRAME THREE */

var positions = [
"-0.46024 0.43058 -0.92588",
"-1.19726 0.28986 -0.67284",
"-1.23825 0.28234 0.52940",
"-0.98187 0.25601 1.23786",
"-0.25130 0.32843 1.49978",
"0.44158 0.33252 1.01640",
"1.14151 0.19230 1.07521",
"1.49075 0.32847 0.10647",
"1.69524 0.31715 -0.41135",
"1.08046 0.26422 -1.14151",

"-1.02931 0.87022 -0.78663",
"-1.41416 0.91802 -0.34148",
"-1.05239 0.89277 0.26526",
"-1.04791 0.91710 0.99895",
"-0.85960 1.16636 1.49199",
"-0.03963 1.05628 1.47910",
"0.53958 1.13737 1.28999",
"1.14150 1.06304 1.06912",
"1.39145 1.27896 0.18262",
"1.38151 0.99329 -0.29432",
"0.92318 1.00883 -1.05192",

"0.25559 1.24071 -0.46539",
"-0.60127 1.18955 -0.34826",
"-0.74047 1.28953 0.25492",
"-0.26752 1.30594 0.12327",
"1.12024 1.44018 -0.34314"]

var idlePosition = "300 300 300"; 

var spawnedAtPosition = [];

rld = 0;

for(var i = 0; i < positions.length; i++){
	spawnedAtPosition.push(false); //Array(positions.length).fill(false);
}

var inactiveArmadillos = [];

var gameStarted = true;

var score = 0;

var spawnSpeed = 2000;

var fileName = "logfile_armadillo_familya_instance5.txt";
var content = "";

var sc_timer = 0;

var count_play = 0;

var first = 0;

var over_write_start = 0;

/** Components **/

AFRAME.registerComponent('log-auth',{
  init: function(){
    
    
    var el = this.el;
    
    el.addEventListener('raycaster-intersected', function(ev, target){
      
      content+= "Auth obj visited: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
    
    });
    
    el.addEventListener('click', function(ev, target){
      
      content+= "Auth obj click: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.cursorEl.id)+" time: "+Date.now()+"\n";
      
    });
    
    el.addEventListener('raycaster-intersected-cleared', function(ev, target){
      
        content += "Raycaster Cleared: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
    });
     
  }
});




AFRAME.registerComponent('scan-elements',{
  init: function(){
    
     var scene = document.querySelector('a-scene');
    
     scene.addEventListener('enter-vr', function(ev, target){
       
       content += "Entered VR: time: "+Date.now()+" \n";
       
       
     });
  },
  tick : function(){
    
    var scene = document.querySelector('a-scene');
    
     var elementsUnderScene = scene.getElementsByTagName('*');

   
      for (var i = 0; i < elementsUnderScene.length; i++) {
          var element = elementsUnderScene[i];
          
          var cur_id = element.id
          

          
          // any element other than the cursors, camera, empty
          // add more what you want to ignore
            if(cur_id!="leftHand" && 
               cur_id!="rightHand" && 
               cur_id!="" && 
               cur_id!="cam" && 
               cur_id!="gazeCursor" &&
               cur_id!="armadillo-parent" &&
               cur_id!="ad" &&
               cur_id!="ad-cover"){

               //console.log("obj",cur_id);

              var obj = document.querySelector('#'+cur_id);



              if(!obj.hasAttribute('log-auth')){
                
                // console.log('hii', obj);
                content+="Auth obj log added: obj: "+cur_id+" time: "+Date.now()+"\n";
                obj.setAttribute('log-auth','');
              }



            }
            

        
        
      }
      //console.log('size', log_obj_map.size);
    
  }
});


AFRAME.registerComponent('distraction-log',{
  init: function(){
    
    var el = this.el;
    
    
    content+= "Ad Created: obj: "+el.id+" time: "+Date.now()+"\n";
    
    
    var cursor = document.querySelector('#gazeCursor');
    var target_pos = new THREE.Vector3(); 
    cursor.object3D.getWorldPosition( target_pos );

    content += ("ad position: "+JSON.stringify(el.getAttribute('position'))+" time: "+Date.now()+"\n");
    content += ("gaze position: "+JSON.stringify(target_pos)+" time: "+Date.now()+"\n");
    
    this.el.addEventListener('click', function(ev, target){
      //console.log('received click', ev.detail);
      
   
        content += "Synthetic Click: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.cursorEl.id)+" time: "+Date.now()+"\n";
      
    });
    
    
    this.el.addEventListener('raycaster-intersected', function(ev, target){
      

      
        content += "Synthetic Visit: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
      
    });
    
    
    
     this.el.addEventListener('raycaster-intersected-cleared', function(ev, target){
      
      
        content += "Raycaster Cleared: obj: "+el.id+" cursor: "+JSON.stringify(ev.detail.el.id)+" time: "+Date.now()+"\n";
      
    });
    
    
    this.el.addEventListener('componentchanged', function(ev, target){
      
      if(ev.detail.name=='position'){
        
          var cursor = document.querySelector('#gazeCursor');
          var target_pos = new THREE.Vector3(); 
          cursor.object3D.getWorldPosition( target_pos );

          content += ("ad position: "+JSON.stringify(el.getAttribute('position'))+" time: "+Date.now()+"\n");
          content += ("gaze position: "+JSON.stringify(target_pos)+" time: "+Date.now()+"\n");
        
      }
    });
    
    
    

    
  },
  
});


AFRAME.registerComponent('log-cam',{
  
  init: function(){
    
    this.camPos = new THREE.Vector3();
    
    // this.camPos.setFromMatrixPosition(cam.object3D.matrixWorld);
    // cam.object3D.getWorldPosition(this.camPos);
    
    
    this.worldQuaternion = new THREE.Quaternion();
    this.worldDirection = new THREE.Vector3();
    this.gaze_pos = new THREE.Vector3(); 

    
    // this.leftCur = document.querySelector('#leftHand');
    // this.rightCur = document.querySelector('#rightHand');
    this.gazeCur = document.querySelector('#gazeCursor');
    this.cam = document.querySelector('#cam');
    
    

    
    this.gazeCur.addEventListener('raycaster-intersection', evt => {
    
    
      var intersected_els = evt.detail.intersections;
          
      if(intersected_els.length>0){
        
        this.get_cam_gaze();
        
        
      }
      
    });
    this.gazeCur.addEventListener('click', evt => {
        this.get_cam_gaze();
      
    });
    
//     this.leftCur.addEventListener('raycaster-intersection', evt => {
    
    
//       var intersected_els = evt.detail.intersections;
          
//       if(intersected_els.length>0){
        
//         this.get_cam_gaze();
        
        
//       }
      
//     });
//     this.leftCur.addEventListener('click', evt => {
//         this.get_cam_gaze();
      
//     });
    
//     this.rightCur.addEventListener('raycaster-intersection', evt => {
    
    
//       var intersected_els = evt.detail.intersections;
          
//       if(intersected_els.length>0){
        
//         this.get_cam_gaze();
        
        
//       }
      
//     });
    
//     this.rightCur.addEventListener('click', evt => {
//         this.get_cam_gaze();
      
//     });
  },
  
  get_cam_gaze: function(){
      
        this.gazeCur.object3D.getWorldPosition( this.gaze_pos );
    
        this.cam.object3D.getWorldPosition(this.camPos);

        this.cam.object3D.getWorldQuaternion(this.worldQuaternion);
        this.worldRotation = new THREE.Euler().setFromQuaternion(this.worldQuaternion);

        // Get world direction

        this.cam.object3D.getWorldDirection(this.worldDirection);


        var fov = this.cam.getAttribute("camera").fov


        content += ('campos: '+ JSON.stringify(this.camPos) +' camdir: '+JSON.stringify(this.worldDirection) +
                    ' camrot: '+JSON.stringify(this.worldQuaternion) + ' gazepos: '+JSON.stringify(this.gaze_pos) +
                    // ' matrix: '+JSON.stringify(cam.object3D.matrixWorld)+
                    ' camfov: '+fov+" time: "+Date.now()+"\n");
      
      
        // console.log('campos: '+ JSON.stringify(this.camPos) +' camdir: '+JSON.stringify(this.worldDirection) +
        //             ' camrot: '+JSON.stringify(this.worldQuaternion) + ' gazepos: '+JSON.stringify(this.gaze_pos) +
        //             // ' matrix: '+JSON.stringify(cam.object3D.matrixWorld)+
        //             ' camfov: '+fov+" time: "+Date.now()+"\n");
      
      
    },
    
  
});



AFRAME.registerComponent('log-data',{

  init: function(){
    

     this.camPos = new THREE.Vector3();
     this.camRot = new THREE.Matrix4();
    
    function downloadFile(data){
            
     const link = document.createElement("a");

     const content = data;
     const file = new Blob([content], { type: 'text/plain' });
     link.href = URL.createObjectURL(file);
     link.download = fileName;
     link.click();
     URL.revokeObjectURL(link.href);
    };
    
    var sceneEl = document.querySelector('a-scene');
    sceneEl.addEventListener('exit-vr', function () {
         console.log("Exit VR");
      
         content+="Exit VR: time: "+Date.now()+"\n";
         //downloadFile(content);

      });
    
    
    var leftCur = document.querySelector('#leftHand');
    var rightCur = document.querySelector('#rightHand');
    var gazeCur = document.querySelector('#gazeCursor');
    var cam = document.querySelector('#cam');
    
    
    
    this.camPos.setFromMatrixPosition(cam.object3D.matrixWorld);
    cam.object3D.getWorldPosition(this.camPos);
    

    // logging whenever the first intesected entity is changing
    
    gazeCur.addEventListener('raycaster-intersection', evt => {
      
          var curData = "";
          var intersected_els = evt.detail.intersections;
          
          if(intersected_els.length>0){
            
            curData += ("Intersection: Gaze Cursor Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
            //console.log(intersected_els.length);
            for(let k=0;k<intersected_els.length;k++){
              
              if(intersected_els[k].object.el.id!=""){
                //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object.el.id);
                curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
              }
            }
            content+=curData;
          }

    });
    
     gazeCur.addEventListener('click', evt => {
       
         content+= "Click: Gaze Cursor Details: time: "+Date.now()+"\n";
         content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

    });
    
//     leftCur.addEventListener('raycaster-intersection', evt => {
    
//           var curData = "";
//           //this.raycaster = evt.detail.el;
//           var intersected_els = evt.detail.intersections;
          
//           if(intersected_els.length>0){
            
//             curData += ("Intersection: Left Raycaster Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
//             for(let k=0;k<intersected_els.length;k++){
//               if(intersected_els[k].object.el.id!=""){
//               //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object);
//               curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
//               }
//             }
//             content+=curData;
//           }
         
//     });
    
//     leftCur.addEventListener('click', evt => {
       
//          content+= "Click: Left Cursor Details: time: "+Date.now()+"\n";
//          content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

//     });
    
    
//     rightCur.addEventListener('raycaster-intersection', evt => {

//           //this.raycaster = evt.detail.el;
//           var curData = "";
//           var intersected_els = evt.detail.intersections;
          
//           if(intersected_els.length>0){
            
//             curData += ("Intersection: Right Raycaster Intersection Details: Count: "+intersected_els.length+" time: "+Date.now()+"\n");
//             for(let k=0;k<intersected_els.length;k++){
//               if(intersected_els[k].object.el.id!=""){
//               //console.log(intersected_els[k].point, intersected_els[k].distance, intersected_els[k].object);
//               curData += ("obj: "+intersected_els[k].object.el.id +" point: "+ JSON.stringify(intersected_els[k].point)+" distance: "+intersected_els[k].distance+"\n");
//               }
//             }
//             content+=curData;
//           }
         
//     });
    
//     rightCur.addEventListener('click', evt => {
       
//          content+= "Click: Right Cursor Details: time: "+Date.now()+"\n";
//          content+= ("obj: "+evt.detail.intersectedEl.id+" point: "+JSON.stringify(evt.detail.intersection.point)+" distance: "+JSON.stringify(evt.detail.intersection.distance)+"\n");

//     });
    

  },
  

});

// adding new code here


AFRAME.registerComponent('add-comp', {
  
  init: function(){
    
    // add the controllers
    // changed the visibility

    console.log('add-comp');

    // var leftController = document.createElement("a-entity");
    // leftController.innerHTML = '<a-entity id="leftHand" laser-controls="hand: left;"  raycaster="objects: .raycastable"  line="visible: true"></a-entity>';
    // document.querySelector("a-scene").appendChild(leftController);
    
    
    
    // var rightController = document.createElement("a-entity");
    // rightController.innerHTML = '<a-entity id="rightHand" laser-controls="hand: right;" line="color: #118A7E; visible: true;" raycaster="objects: .raycastable"  ></a-entity>';
    // document.querySelector("a-scene").appendChild(rightController);
    
    
    var scene = document.querySelector('a-scene');

      // Get all elements under <a-scene>
      var elementsUnderScene = scene.getElementsByTagName('*');

     // overriding the classes of target objects
    
      for (var i = 0; i < elementsUnderScene.length; i++) {
          var element = elementsUnderScene[i];

          console.log(element);
          
          var cur_id = element.id
          if(cur_id!="leftHand" && cur_id!="rightHand" && cur_id!="cam" && cur_id!="gazeCursor"){
          //if (cur_id.startsWith("arm") && !cur_id.startsWith("armadillo-parent") && !cur_id.startsWith("armadillo") ) {
            
            console.log(cur_id);
            //var obj = document.querySelector('#'+cur_id);
            
            //var nm = obj.getAttribute('num');
            
            // if(nm%2==0){
              element.setAttribute('over-writing','');
              element.setAttribute('class','raycastable');
              
            // }
            
            
          }

      }
    
    
    
  },
});




AFRAME.registerComponent('over-writing',{
  init: function(){
    
    var cur_el = this.el;
    
    // this.el.sceneEl.addEventListener('enter-vr', function(ev, target){
    //   over_write_start = 1;
    // });
    
    this.el.addEventListener('raycaster-intersected', function(ev, target){
    // this.el.addEventListener('click', function(ev, target){
          
          if(over_write_start>=1){
            content += "raycaster intersected overwritten: time: "+Date.now()+"\n";
            var cur_scene = document.querySelector('a-scene');
            console.log(cur_el);


            var dist_el = document.createElement('a-entity');

            
            cur_scene.appendChild(dist_el);


            var dist_el_text = document.createElement('a-text');

            dist_el.appendChild(dist_el_text);

            dist_el_text.setAttribute('value',' Wrong \ntarget!!');
            dist_el_text.setAttribute('scale',' 0.5 0.5 0.5');
            dist_el_text.setAttribute('color','red');


            dist_el_text.setAttribute('position','0 0 0');
            // dist_el_text.setAttribute('position','0.302 2.4 -2.450');

            dist_el.setAttribute('class','raycastable');


            
            dist_el.setAttribute('geometry',{
              primitive: 'box',
              width: 1,
              height: 1,
              depth: 0.4


            });
            
            dist_el.setAttribute('material',{
              color: 'yellow',
              opacity: 0.8
            });
            
            
            var gz = document.querySelector('#gazeCursor');
    
            var rot = gz.getAttribute('rotation');




            var target_pos = new THREE.Vector3(); 
            var target_qt = new THREE.Quaternion()

            gz.object3D.getWorldPosition( target_pos );



            gz.object3D.getWorldQuaternion(target_qt);



            var tmpEuler = new THREE.Euler();

            tmpEuler.setFromQuaternion(target_qt.normalize()); 


            dist_el.setAttribute("position",{
              x: target_pos.x,
              y: target_pos.y,
              z: target_pos.z
            });



            dist_el.setAttribute('id',"dist_el");

            dist_el.setAttribute('distraction-log','');

          }
              
              
              
      });
    

    
    this.el.addEventListener('raycaster-intersected-cleared', function(ev, target){
              
              // console.log('oops',cur_el.getAttribute('id'));
      
      
             if(over_write_start>=1){
      
              var alert_comp = document.querySelector('#dist_el');
      
              if(alert_comp){
                content+= "Ad Removed: obj: "+alert_comp.id+" time: "+Date.now()+"\n";
                alert_comp.parentNode.removeChild(alert_comp);
              }
               
             }
              
              
              
              
              
      });
    
  }
});


AFRAME.registerComponent('game-manager', {
  schema: {},
  init: function () {

	for(var i = 0; i < 20; i++){
		var el = document.createElement('a-gltf-model');
		var sceneEl = document.querySelector('a-scene').querySelector('#armadillo-parent');
		
		var rand = Math.floor(Math.random() * positions.length);
		while(spawnedAtPosition[rand])
		{
			rand = Math.floor(Math.random() * positions.length);
		}
		
		el.setAttribute('armadillo','');
    el.setAttribute('id','arm'+i);
    el.setAttribute('num',i);
		el.setAttribute('position', idlePosition);
		// el.setAttribute('look-at','#origin');
		el.setAttribute('src','#armadillo');
    // el.setAttribute('src','#jerry');
		el.setAttribute('index', -1);

		sceneEl.appendChild(el);
		
		inactiveArmadillos.push(el);
	}
    
  document.querySelector('a-scene').addEventListener('loaded', function () {
    
      gameStarted = true;
      
       content +="Game Started "+Date.now()+"\n";

       document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "true");
			

      
        if(first!=0){

        var msg = document.querySelector('#msg');
        msg.setAttribute('visible', true);
        // Hide after duration
        setTimeout(() => {
          msg.setAttribute('visible', false);
        }, 2000);

        }
        else{
          var msg = document.querySelector('#msg');
          msg.setAttribute('class', 'raycastable');
        }

    });
    
	this.tick = AFRAME.utils.throttleTick(this.tick, spawnSpeed, this);
  },

  tick: function () {
	if(!gameStarted)
		return;
  
	if(inactiveArmadillos.length > 0){
		var el = inactiveArmadillos.shift();
		el.components.armadillo.spawn();
	}
	
	}
});

AFRAME.registerComponent('armadillo', {
  schema: {
	lifeTime: { type: 'number', default: 5000.0 },
	alive: {type: 'boolean', default: false}
  },
  
  init: function () {
	this.el.addEventListener('fusing', this.onCalledFunc.bind(this));
  this.el.addEventListener('raycaster-intersected-cleared', this.onCalledFuncRC.bind(this));
  this.el.addEventListener('click', this.onCalledFuncClick.bind(this));
  },
  
  onCalledFuncRC: function(){
    
    var text_comp = document.querySelector('#dist_el_text2');
        if(text_comp){
          text_comp.parentNode.removeChild(text_comp);
        }
    
  },

	
  onCalledFunc: function (){


    
  content += "fusing: time: " +Date.now()+" "+JSON.stringify(this.el.getAttribute('position'))+"\n";
    
    
  var cur_pos = this.el.getAttribute('position');
  var cur_rot = this.el.getAttribute('rotation');
    
  var arm_sc = document.querySelector('a-scene').querySelector('#armadillo-parent');

  
    
  var dist_el_text = document.createElement('a-text');


  arm_sc.appendChild(dist_el_text);

  dist_el_text.setAttribute('value','Click on the Armadillo');
  dist_el_text.setAttribute('color','blue');
  dist_el_text.setAttribute('scale','1 1 1');

  //dist_el_text.setAttribute('position','0.302 2.6 -2.450');
  dist_el_text.setAttribute('id',"dist_el_text2");
  // dist_el_text.setAttribute('class','raycastable');
    
    
  dist_el_text.setAttribute("position",{
      x: cur_pos.x+0.4,
      y: cur_pos.y+0.3,
      z: cur_pos.z
    });

  dist_el_text.setAttribute("rotation",{
      x: cur_rot.x,
      y: cur_rot.y,
      z: cur_rot.z
    });
    

    
  },
  
  
  onCalledFuncClick: function (){


    
  var whackSound = document.querySelector('a-scene').querySelector('#whack-sound');
	whackSound.setAttribute('position', this.el.getAttribute('position'));
	whackSound.components.sound.playSound();

	var sc_comp = document.querySelector('#score');
  score = score+1;
  sc_comp.setAttribute('value',"Score: "+score);
  

	this.destroy();
    
  },

  tick: function (time, timeDelta) {
	if(!this.data.alive)
		return;
  
	this.data.lifeTime -= timeDelta;
	if(this.data.lifeTime < 0)
		this.destroy();
  },
  
  spawn: function(){
	var rand = Math.floor(Math.random() * positions.length);
	while(spawnedAtPosition[rand])
	{
		rand = Math.floor(Math.random() * positions.length);
	}
	this.el.setAttribute('position', positions[rand]);
	
	var giggleSound = document.querySelector('a-scene').querySelector('#giggle-sound');
	giggleSound.setAttribute('position', positions[rand]);
	giggleSound.components.sound.playSound();
	
	spawnedAtPosition[rand] = true;		
	this.el.setAttribute('index', rand);
	
	this.data.lifeTime = 5000.0;
	this.data.alive = true;
  },
  
  destroy: function(){
    console.log('destroy called');
	this.el.setAttribute('position', idlePosition);
	spawnedAtPosition[this.el.getAttribute('index')] = false;
	this.el.setAttribute('index', -1);
	this.data.alive = false;
	inactiveArmadillos.push(this.el);
  }
});



var startTimerValue =  20000;

var timer =  -2;

AFRAME.registerComponent('timer', {
	schema: {default: false},
	tick: function (time, timeDelta) {

		if(this.data){
			var el = this.el;
			timer -= timeDelta;
      var secs = Math.ceil(timer / 1000);
      var mins = Math.floor(secs / 60);
      secs = secs % 60;
      var tim = mins + ":" + secs.pad();
			el.setAttribute("value", tim);
		}
    
    
    
    
		if(timer <= 0 && gameStarted && el){
      
      console.log("here",el);
      

      document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "false");

      gameStarted = false;
			el.setAttribute("value", "Finished!");
      
      var cur_scene = document.querySelector('a-scene');
      
      
       if(first==0){
         
         
        var warn_comp = document.createElement('a-image');
        warn_comp.setAttribute('src', '#banner')
        warn_comp.setAttribute("position","0 3.2 -2.450");
        warn_comp.setAttribute("id","warn_comp");
        warn_comp.setAttribute("scale","3 0.5");
        warn_comp.setAttribute('distraction-log','');
         
        var warn_comp_2 = document.createElement('a-text');
        warn_comp_2.setAttribute("value","Click on VR to play again");
        warn_comp_2.setAttribute("position","-1.4 3.2 -2.449");
        warn_comp_2.setAttribute("color","white");
        warn_comp_2.setAttribute("id","warn_comp_2");
        warn_comp_2.setAttribute("scale","1 1 1");
         
        
        
        cur_scene.appendChild(warn_comp);
        cur_scene.appendChild(warn_comp_2);
        
      }
    
      
      if(first==0){
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          var score_param = urlParams.get('score');
          
          if(!score_param)
            score_param = 0;
        
          document.querySelector('#score').setAttribute("value","Score: "+score_param);
          
        }

        if(first==1){
          
          document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "false");
        
          
          var warn_comp =document.querySelector('#warn_comp');
          var warn_comp_2 =document.querySelector('#warn_comp_2');
          console.log('here warn');

          if(warn_comp){
            content+= "Ad Removed: obj: "+warn_comp.id+" time: "+Date.now()+"\n";
            warn_comp.parentNode.removeChild(warn_comp);
          }
          
          if(warn_comp_2){
            warn_comp_2.parentNode.removeChild(warn_comp_2);
          }

          var cur_timer = document.querySelector('#timer');
          cur_timer.setAttribute("value","0:20");
          timer = startTimerValue;
          
          gameStarted = true;
        
        content +="Game Started "+Date.now()+"\n";

        document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "true");
        

          var msg = document.querySelector('#msg');
          msg.setAttribute('visible', true);
          // Hide after duration
          setTimeout(() => {
            msg.setAttribute('visible', false);
          }, 2000);


          document.querySelector('#score').setAttribute("value","Score: 0");
          score=0;
          
      }
                        

      
		}
    
    

    
    
    
	}
});

AFRAME.registerComponent('reload-comp',{

  init: function(){
    var scene = document.querySelector('a-scene');
    scene.addEventListener('enter-vr', function(ev, target){
    console.log('in vr');
    window.location.reload();

    });
  },

  tick: function(){
    var scene = document.querySelector('a-scene');

    if (scene.is('vr-mode')) {
      over_write_start = 1;
      if(first==0){
          first = 1;
          document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "false");
          var warn_comp =document.querySelector('#warn_comp');
          var warn_comp_2 =document.querySelector('#warn_comp_2');
          console.log('here warn');

          if(warn_comp){
            content+= "Ad Removed: obj: "+warn_comp.id+" time: "+Date.now()+"\n";
            warn_comp.parentNode.removeChild(warn_comp);
          }
          
          if(warn_comp_2){
            warn_comp_2.parentNode.removeChild(warn_comp_2);
          }

          var cur_timer = document.querySelector('#timer');
          cur_timer.setAttribute("value","0:20");
          timer = startTimerValue;
          
          gameStarted = true;
        
          content +="Game Started "+Date.now()+"\n";
          document.querySelector('a-scene').querySelector('#timer').setAttribute("timer", "true");

          var msg = document.querySelector('#msg');
          msg.setAttribute('visible', true);
          // Hide after duration
          setTimeout(() => {
            msg.setAttribute('visible', false);
          }, 2000);


          document.querySelector('#score').setAttribute("value","Score: 0");
          score=0;
        }
        else{
          first = 1;
        }
        
    }

  }

});




Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
