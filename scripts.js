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

// adding new code here


AFRAME.registerComponent('add-comp', {
  
  init: function(){
    
    // add the controllers
    // changed the visibility

    console.log('add-comp');


    var leftController = document.createElement("a-entity");
    leftController.innerHTML = '<a-entity id="leftHand" laser-controls="hand: left;"  raycaster="objects: .raycastable"  line="visible: false"></a-entity>';
    document.querySelector("a-scene").appendChild(leftController);
    
    var rightController = document.createElement("a-entity");
    rightController.innerHTML = '<a-entity id="rightHand" laser-controls="hand: right;" line="color: #118A7E; visible: false;" raycaster="objects: .raycastable"  ></a-entity>';
    document.querySelector("a-scene").appendChild(rightController);
    
    
    var scene = document.querySelector('a-scene');

      // Get all elements under <a-scene>
      var elementsUnderScene = scene.getElementsByTagName('*');

     // overriding the classes of target objects
    
      for (var i = 0; i < elementsUnderScene.length; i++) {
          var element = elementsUnderScene[i];

          console.log(element);
          
          var cur_id = element.id
          if(cur_id!="leftHand" && cur_id!="rightHand" && cur_id!="cam" && cur_id!="gazeCursor"){
            
            console.log(cur_id);
  
              element.setAttribute('over-writing','');
              element.setAttribute('class','raycastable');
              

            
            
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

          }
              
              
              
      });
    

    
    this.el.addEventListener('raycaster-intersected-cleared', function(ev, target){
      
      
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
		el.setAttribute('src','#armadillo');
		el.setAttribute('index', -1);
    el.setAttribute('class','clickable');

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

    const session = scene.renderer.xr.getSession();

  // Delay until WebXR is fully live
  if (session) {
    setTimeout(() => {
      session.requestAnimationFrame(() => {
        window.location.reload();

      });
    }, 200); // delay ensures WebXR session fully initialized
  }

    //window.location.reload();
    

    });

  },

  tick: function(){
    var scene = document.querySelector('a-scene');

    if (scene.is('vr-mode')) {
      over_write_start = 1;
      if(first==0){

          var elem = document.createElement('a-entity');
          elem.setAttribute('position', '0 0 -1');
          elem.setAttribute('scale', '3 3 3');
          elem.setAttribute('class', 'raycastable');
          scene.appendChild(elem);
          elem.setAttribute('add-comp', '');

          
          
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
