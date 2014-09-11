// JavaScript Document

var $state="";	//globals as we have callbacks that need this data.
var $program=""; // ned to add program variable for resorting 
var $xmldata="";	
var $states=[]; // we'll use this array to keep which states are available in the loaded data
var $counts={}; // we'll store company counts per-state here

$(document).ready(function(){
	$.ajax({							//get the XML data
 		 	url: "xml/xmlfiltering_copy_v2.xml",	//URL to get the data from, this does work in sub directory
 		 	success: loadTable			//callback on success
	});				   
});

function changeFilter(ctry){
	$state=ctry;				//set global state variable to changed state
	$(".datarow").remove();		//clear table
	loadTable($xmldata, false);		//rebuild
}

function changeProgram(prgm){
	$program=prgm;				//set global state variable to changed state
	$(".datarow").remove();		//clear table
	loadTable($xmldata, false);		//rebuild
}
function changeState(ste){
	$state=ste;				//I recreated new variable, with new function Not working?
	$(".datarow").remove();		//clear table
	loadTable($xmldata, false);		//rebuild
}


function loadTable(data, updateMapData){
	if (undefined == updateMapData)
		updateMapData = true;
	$xmldata=data;					//set our global XML variable to the data from the callback for re-use later.
	if (updateMapData) {
		$states=[]; // reset states array
		$counts={}; // reset company counts2e
	}
	$(data).find("vendor state:contains('"+$state+"')").parent().each(function(){ //find each row in the XML with the state we want to show.
		
		var $this=$(this);							//cache selector 
		var $program=$this.find("program").text();		//get program
		var $company=$this.find("company").text();			//get companyephone
		var $state=$this.find("state").text();	//get state
		var $city=$this.find("city").text();	//get City
					
		$("#datatable").append("<tr class='datarow'><td>"+$program+"</td><td>"+$company+"</td><td>"+$city+"</td><td>"+$state+"</td></tr>"); //output table row
		
		// add state
		if ( updateMapData && -1 == $.inArray($state, $states) ) {
			$states.push($state);
			$counts[$state] = 0;
		}
		if ( updateMapData ) {
			$counts[$state] += 1;
		}
	});	
	zebraStripe();
	if ( updateMapData )
		updateMap();
}


//function from previous tutorial with minor change to selector to zebrastripe the table.
function zebraStripe(){
	$("#datatable").each(function(){   
 	var $s=0;
		$(this).find("tr").each(function(){   
			var $t = $(this).children("td");
			$s++; 
			if($s%2==1)
				$t.addClass("stripe"); 
			else
				$t.removeClass("stripe");
		});
  	});
}

// updates map -- makes currently available states clickable on the map
function updateMap(){
	$map.dataProvider.areas = [];
	for(var $x in $states) {
		$map.dataProvider.areas.push({ id: "US-" + $states[$x], groupId: "US-" + $states[$x], selectable: true, value: $counts[$states[$x]] });
		if ( 'DC' == $states[$x] ) {
			$map.dataProvider.images[0].value = $counts[$states[$x]];
			$map.dataProvider.images[0].title = "Washington, DC";
		}
	}
	$map.validateData();
	// now let's take the color of the area and apply to DC callout image
	for ( var x in $map.dataProvider.areas ) {
		if ( "US-DC" == $map.dataProvider.areas[x].id ) {
			$map.dataProvider.images[0].color = $map.dataProvider.areas[x].colorReal;
			$map.validateData();
			break;
		}
	}
}
