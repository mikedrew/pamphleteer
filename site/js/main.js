$(document).on('ready',function(){

	$('#ssidlist').on('input propertychange',function(){
		
		var c = $('#ssidlist').val();
		
		if(c.length > 0){
			$('#generateButton').attr('disabled',false)
			$('#startStopButton').attr('disabled',false)
		}
		else{
			$('#generateButton').attr('disabled',true)
			$('#startStopButton').attr('disabled',true)
		}
		
	});
	
	$('#generateButton').on('click',function(){
		
		var seedSSID = $('#ssidlist').val().toLowerCase();
		
		var ssidList = generateSSID(seedSSID);
		
		ssidList = ssidList.join('\n');
		
		$('#ssidlist').val(ssidList);
	});
	
	
	$('#startStopButton').on('click',function(){
		
		if($('#startStopButton').val() === 'Start'){
			var ssidCsvList = $('#ssidlist').val().split('\n').join(',');
			
			$.ajax({
				
				type:'POST',
				url: '/start',
				data:{ssid:ssidCsvList}
				
			});
			
			$('#startStopButton').val('Stop');
		}
		else if($(this).val() === 'Stop'){
			
			$.ajax({
				
				type:'POST',
				url: '/stop'
				
				
			});
			
			$('#startStopButton').val('Start');
			
		}
		
	});
	
	function updateServerTime(){

		$.ajax({
			url: '/hello',
			success:function(result){

				$('#time').text(result);
			},
			error:function(err){
				console.log('error');
			}
		});
	}
	
	setInterval(updateServerTime,1000);
	
});




function generateSSID(seedSSID){

	var rtnSSIDs = [];

	var sp = seedSSID.split("");
	for (var i = 0, l = 1 << seedSSID.length; i < l; i++) {
		
		for (var j = i, k = 0; j; j >>= 1, k++) {
			sp[k] = (j & 1) ? sp[k].toUpperCase() : sp[k].toLowerCase();
		}
		
		var st = sp.join("");  
		rtnSSIDs.push(st);
	}

	return rtnSSIDs
}
