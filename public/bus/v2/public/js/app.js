// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


module.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.controller('TodoCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, $ionicSlideBoxDelegate,  $ionicPopover, $http, accessToken) {

    $scope.accessToken = accessToken;
    
	$scope.busTitle = document.getElementById("busTitle");
	
	$scope.options = {
		loop: false,
		effect: 'page',
		speed: 500,
	}
	
	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
		$scope.slider = data.slider;
	});
	
	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
		$scope.activeId = data.slider.activeIndex;
		$scope.busTitle.innerHTML = $scope.busTitles[$scope.activeId];
        $scope.$broadcast('scroll.refreshComplete');
	});

	$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
	});
	
	$scope.busIds = ['133', '3220', '3221', '3222'];
	$scope.busTitles = ['133', '132', '172', '132經高鐵', '9025'];
	
	$scope.activeId = 0; //Array index of currently active busInfo
	$scope.busInfos = []; //Temporary space for busInfo
  
	$scope.req = {
		method: 'GET',
		url: 'https://api.cc.ncu.edu.tw/bus_dev/v1/routes/133/estimate_times',
		headers: {
			'Content-Type': undefined,
			'Authorization': 'Bearer' + $scope.accessToken
		},	
	}
    
    $scope.refreshAccessTkn = function(){
        req = {
            method: 'GET',
            url: 'http://140.115.189.151:9494/bus/v2/accessToken'
        }
        $http(req).then(function(resp){
            $scope.accessToken = resp.data;
        }, function(err){
            console.error('ERR', err);
        })
        
    };
    
    $scope.formatBusTime = function(busInfo){
        for (var i=0;i<busInfo.BusDynInfo.BusInfo.Route.EstimateTime.length;i++){
            if(busInfo.BusDynInfo.BusInfo.Route.EstimateTime[i].comeTime === ''){
                busInfo.BusDynInfo.BusInfo.Route.EstimateTime[i].comeTime = '末班車已駛離'
            }
        }
        return busInfo
    };
  
	$scope.refresh = function(infoId){
		req = $scope.req
		req.url = 'https://api.cc.ncu.edu.tw/bus_dev/v1/routes/' + $scope.busIds[infoId] + '/estimate_times';
		$http(req).then(function(resp){
			console.log('Success', resp); // JSON object
			$scope.busInfos[infoId] = $scope.formatBusTime(resp.data);
			$scope.$broadcast('scroll.refreshComplete');
		}, function(err){
			console.error('ERR', err);
            $scope.refreshAccessTkn();
			$scope.$broadcast('scroll.refreshComplete');
		}) 
		
	};
    
	$scope.getAllBusInfo = function(state){
		if(state === -1){ //no bus info retrieved in this time slot yet.
			req = $scope.req
			req.url = 'https://api.cc.ncu.edu.tw/bus_dev/v1/routes/' + $scope.busIds[0] + '/estimate_times';
			$http(req).then(function(resp){
				console.log('Success, state: ' + state, resp); // JSON object
				$scope.busInfos[0] = $scope.formatBusTime(resp.data);
				$scope.getAllBusInfo(0);
			}, function(err){
				console.error('ERR', err);
                $scope.refreshAccessTkn();
				console.log("state " + state + " failed, trying again.");
				setTimeout(function(){
					$scope.getAllBusInfo(-1)
				}, 30*1000);
			})
		}else if(state < $scope.busIds.length){
			req = $scope.req
			req.url = 'https://api.cc.ncu.edu.tw/bus_dev/v1/routes/' + $scope.busIds[state] + '/estimate_times';
			$http(req).then(function(resp){
				$scope.busInfos[state] = $scope.formatBusTime(resp.data);
				console.log('$scope.busInfos[state]', $scope.busInfos[state])
				$scope.getAllBusInfo(state+1);
			}, function(err){
				console.error('ERR', err);
                $scope.refreshAccessTkn();
				console.log("state " + state + " failed, trying again.");
				setTimeout(function(){
					$scope.getAllBusInfo(state)
				}, 30*1000);
			}) 
		}else{
			setTimeout(function(){
				$scope.getAllBusInfo(-1)
			}, 30*1000);
		}
	};
    
    

	$scope.getAllBusInfo(-1);
	$ionicSlideBoxDelegate.update(); //Slide pager might finished rendering before Bus data arrived, thus rendeering without bus data
	
  
  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  
  $scope.goToHSROW = function(){
	window.location = "https://www.thsrc.com.tw/index.html";  
  };
  
  $scope.goToHSRAPP = function(){
	window.location = "https://play.google.com/store/apps/details?id=tw.com.thsrc.texpress&hl=zh_TW";  
  };
  
  $scope.goToTROW = function(){
	window.location = "http://twtraffic.tra.gov.tw/twrail/";  
  };
  
  $scope.goToTRAPP = function(){
	window.location = "https://play.google.com/store/apps/details?id=tw.gov.tra.TWeBooking";  
  };
  
    // Create and load main-station-info Modal
	$ionicModal.fromTemplateUrl('terminal-info.html', function(modal) {
		$scope.terminalInfoModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	// Open terminalInfo modal
	$scope.openTerminalInfoModal = function() {
		$scope.terminalInfoModal.show();
	};
	// Close terminalInfo modal
	$scope.closeTerminalInfoModal = function() {
		$scope.terminalInfoModal.hide();
	};
  
    // Create and load info Modal
	$ionicModal.fromTemplateUrl('info.html', function(modal) {
		$scope.infoModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	// Open info modal
	$scope.openInfoModal = function() {
		$scope.infoModal.show();
	};
	// Close info modal
	$scope.closeInfoModal = function() {
		$scope.infoModal.hide();
	};
  
	$scope.timeTable = [];
	// Create and load time table Modals
	$ionicModal.fromTemplateUrl('public/timetables/133timetable.html', function(modal) {
		$scope.timeTable[0] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/3220timetable.html', function(modal) {
		$scope.timeTable[1] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/3221timetable.html', function(modal) {
		$scope.timeTable[2] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/3222timetable.html', function(modal) {
		$scope.timeTable[3] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/9025_Gotimetable.html', function(modal) {
		$scope.timeTable[4] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/9025_Backtimetable.html', function(modal) {
		$scope.timeTable[5] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/9025_Go_NCUtimetable.html', function(modal) {
		$scope.timeTable[6] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('public/timetables/9025_Back_NCUtimetable.html', function(modal) {
		$scope.timeTable[7] = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	
	// Open time table
	$scope.openTimeTable = function() {
		$scope.timeTable[$scope.activeId].show();
	};
	// Close time table
	$scope.closeTimeTable = function() {
		$scope.timeTable[$scope.activeId].hide();
	};
  
  
  
})
