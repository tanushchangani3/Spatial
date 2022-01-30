setTimeout(
  function() 
  {
$(document).ready(function(){

    var len = $(document.getElementsByTagName('audio')).length;
    var context = new Array(len);
    var source = new Array(len);
    var filter = new Array(len);
    var gain = new Array(len);
    var stereo = new Array(len);
    var context = new AudioContext();

    $( ".wrapper div" ).draggable({
        drag: function( event, ui ) {
            update();
        }
    });

    for (var i = 0; i < len; i++) {
        source[i] = context.createMediaElementSource(document.getElementsByTagName('audio')[i]);
        filter[i] = context.createBiquadFilter();
        gain[i] = context.createGain();
        stereo[i] = context.createStereoPanner();
        source[i].connect(filter[i]);
        filter[i].connect(gain[i]);
        gain[i].connect(stereo[i]);
        stereo[i].connect(context.destination);
        filter[i].type = 'lowpass';
    }
    update(); 
    function update() {
        for (var i = 0; i < len; i++) {
            console.log(filter[i].frequency.value);
            topoffset = $("#listener").offset().top - $(document.getElementsByTagName('audio')[i]).offset().top;
            leftoffset = $("#listener").offset().left - $(document.getElementsByTagName('audio')[i]).offset().left;
            
            if(topoffset>0) {
                filter[i].frequency.value = 20000;
            } else if (topoffset>-90) {
                filter[i].frequency.value = 20000-(Math.pow(Math.hypot(50*topoffset, leftoffset),1.2)*0.7);
            } else {
                filter[i].frequency.value = 3650;
            }
                console.log("Filter: "+filter[i].frequency.value);
            var gainCalc = Math.max(1 - 2.5*0.0002*Math.hypot(topoffset,leftoffset), 0);
            if(gainCalc > 0) {
                gain[i].gain.value = Math.max(0.5*(gainCalc - Math.abs(stereo[i].pan.value*0.3)), 0);
                console.log("Gain: "+gainCalc);
            }
            if (isNaN(Math.cos(Math.atan(topoffset/-leftoffset)))) {
                stereo[i].pan.value = 0;
            } else {
                console.log(gainCalc);
                stereo[i].pan.value = Math.sign(-leftoffset)*Math.cos(Math.atan(topoffset*0.5/(-leftoffset)))*0.75;
            }   
                console.log("Stereo: "+stereo[i].pan.value);
        }
    }
});
}, 1000);
    

