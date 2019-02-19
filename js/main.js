(function(){
	var app = angular.module('rosters', ['ngAnimate']);
	app.controller('mainController', ['$http', '$scope', function($http, $scope){      
            
        
        var tray = document.getElementById('tray');
        var trayback = document.getElementById('trayback');

        var mc = new Hammer(tray);
        mc.on("swipeleft", function(ev, shutTray) {
            $scope.shutTray();
        });    
        
        var md = new Hammer(trayback);
        md.on("swipe", function(ev, shutTray) {
            $scope.shutTray();
        }); 
        
        $scope.shutTray = function(){
            $("#tray, .trayback , #mainSection").toggleClass("closed");            
        }
        
        
        
        
        $scope.favs = function(){
            alert("Favourites are pending development");
        }
        
        $scope.playersNav = function(){
            alert("Top Players is pending development");
        }   
        
		$scope.players = [];        
        
        $scope.selectedTeam = "https://statsapi.web.nhl.com/api/v1/teams/24?hydrate=roster(person(stats(splits=statsSingleSeason)))";
        
        $scope.selectedTeamStats = "https://statsapi.web.nhl.com/api/v1/teams/24?hydrate=record(teamRecords)&season=20182019";
        
        $http.get("https://statsapi.web.nhl.com/api/v1/teams?hydrate=record(teamRecords)&season=20182019").success(function(data){
            $scope.teamsData = data; 
            
        }).error(function(){
            console.log("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though.");
        });
        $scope.sorterFunc = function(team){
            return parseInt(team.record.leagueRank);
        };       
        $scope.sorterFuncConf = function(team){
            return parseInt(team.record.conferenceRank);
        };
        
        $scope.playerPosition = " ";
        
        $scope.playerPositionGroup = function(playerType){
            $scope.playerPosition = playerType;
            console.log($scope.playerPosition);
        };
        
        $scope.playerIDs = [];
                
        $http.get($scope.selectedTeam).success(function(data){
			 $scope.players = data; 
                angular.forEach($scope.players.teams[0].roster.roster, function (value, key) {
                    $scope.playerIDs.push(value.person.id);
                     
                });
                console.log($scope.playerIDs);
		}).error(function(){
			 alert("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though.");
		});
        
        $http.get($scope.selectedTeamStats).success(function(data){
            $scope.teamStatsData = data; 
            
        }).error(function(){
            console.log("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though.");
        });
        
        $scope.changeTeamStats = function(arg){
            $scope.playerIDs = [];
            console.log(arg);
            $http.get("https://statsapi.web.nhl.com/api/v1/teams/"+arg+"?hydrate=record(teamRecords)&season=20182019").success(function(data){
                console.log("got the team data....");
                $scope.teamStatsData = data;              
                
            }).error(function(){
                console.log("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though.")
            });
            
            //http://statsapi.web.nhl.com/api/v1/teams/1?hydrate=record(teamRecords)&season=20182019
        };
        
        
        
        $scope.changeTeam = function(selectedTeam){
            $http.get("https://statsapi.web.nhl.com/api/v1/teams/"+selectedTeam+"?hydrate=roster(person(stats(splits=statsSingleSeason)))").success(function(data){
                $scope.playerIDs = [];
                $scope.players = data;
                $scope.selectedPlayer = "";
                $scope.playerPosition = "";
                $scope.teamID = $scope.players.teams[0].id;
                $scope.changeTeamStats($scope.teamID);
                
                angular.forEach($scope.players.teams[0].roster.roster, function (value, key) {
                    $scope.playerIDs.push(value.person.id);
                     
                });
                console.log($scope.playerIDs);
                
		      }).error(function(){
			     
                alert("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though.");
                
		      });
        }; 
        
        
        
        $scope.panel = this;
        this.tab =  1;
		this.selectTab = function(setTab){
			this.tab = setTab;
		};
		this.isSelected = function(checkTab){
			return this.tab === checkTab;
		};
        
        $scope.getNumber = function(num) {            
            return new Array(num);   
        }
        
        // players
        $scope.selectedPlayer = "";
        $scope.theirGoals = [];
        $scope.theirAssists = [];
        $scope.theirTotals = [];
        $scope.theirSeasons =[];
        $scope.theirLeagues = [];
        $scope.theirAvShifts = [];
        
        
        $scope.theirAvHits = [];
        $scope.theirAvShots = [];
        $scope.theirAvBlocks = [];
        $scope.theirAvGoals = [];
        $scope.theirAvAssists = [];
        $scope.theirAvIceTime = [];
        
        $scope.shiftWidth = null;
        $scope.hitWidth = null;
        $scope.shotWidth = null;
        $scope.blocksWidth = null;
        
        $scope.shifts = null;
        
        
        $scope.getGoals = function(selectedPlayerData){ 
            
            if(selectedPlayerData.people[0].primaryPosition.type != 'Goalie'){
                $('[data-toggle="tooltip"]').tooltip();
                angular.forEach(selectedPlayerData.people[0].stats[0].splits, function (value, key) {
                $scope.theirSeasons.push(value.season.slice(0,4)+"/"+value.season.slice(4,8)+"<br> "+value.league.name);
                $scope.theirGoals.push(value.stat.goals);
                $scope.theirLeagues.push(value.league.name); 
                $scope.theirAssists.push(value.stat.assists);
                $scope.theirTotals.push(value.stat.points);
                
                //Shifts
                $scope.theirAvShifts.push(value.stat.shifts/value.stat.games);
                $scope.shifts = Math.round($scope.theirAvShifts.pop());
                $scope.shiftWidth = 100/$scope.shifts;
                //Hits                           
                $scope.theirAvHits.push(value.stat.hits/value.stat.games);
                $scope.hits = Math.round($scope.theirAvHits.pop());
                $scope.hitWidth = 100/$scope.hits;
                //Shots
                $scope.theirAvShots.push(value.stat.shots/value.stat.games);
                $scope.shots = Math.round($scope.theirAvShots.pop());
                $scope.shotWidth = 100/$scope.shots;
                //Blocks
                $scope.theirAvBlocks.push(value.stat.blocked/value.stat.games);
                $scope.blocks = Math.round($scope.theirAvBlocks.pop());
                $scope.blockWidth = 100/$scope.blocks;
                
                $scope.theirAvGoals.push(value.stat.goals/value.stat.games);
                $scope.theirAvAssists.push(value.stat.assists/value.stat.games);    
                $scope.theirAvIceTime.push(value.stat.games*60/value.stat.timeOnIce); 
                
            });
            
            Highcharts.chart(player, {
                title: {
                    text:null
                },
                chart:{
                                
                },
                xAxis: {
                    categories: $scope.theirSeasons,
                        labels: {
                            formatter: function () {                            
                                return this.value.slice(0, 9);                            
                        }
                    }
                },
                plotOptions: {
                    colors:["$A2","#607d8b","#263238"],
                area: {
                    
                    marker: {
                        radius: 1
                    },
                    lineWidth: 0.5,
                }
            },
                series:[{
                    name: 'Goals',
                    step: 'right',
                    data: $scope.theirGoals
                        
                },{
                    name: 'Assists',
                    step: 'right',
                    data: $scope.theirAssists
                },{
                    name: 'total',
                    step: 'right',
                    data: $scope.theirTotals
                }]
            });
            }else {
                console.log("Goalie?");
                
                
            }
            
        };
        $('#myModal').on('hidden.bs.modal', function (e) {
            $scope.selectedPlayerData = null;
            $scope.theirGoals = [];
            $scope.theirAssists = [];
            $scope.theirTotals = [];
            $scope.theirSeasons =[];
            $scope.theirLeagues = [];
            $scope.theirAvShifts = [];
            $scope.theirAvHits = [];
            $scope.theirAvShots = [];
            $scope.theirAvBlocks = [];
            $scope.theirAvGoals = [];
            $scope.theirAvAssists = [];
            $scope.theirAvIceTime = [];
            $scope.shiftWidth = null;
            $scope.hitWidth = null;
            $scope.shotWidth = null;
            $scope.blocksWidth = null;
            $scope.shifts = null;
            $scope.hits = null;
            $scope.shots = null;
            $scope.nextPlayer = null;
            $scope.prevPlayer = null;
            $scope.rosterLength = null;
        });        
        
        $scope.nextPlayer = null;
        $scope.prevPlayer = null;
        $scope.rosterLength = null;
        
        $scope.getPlayer = function(selectedPlayer){
            $scope.selectedPlayerData = null;
            $scope.theirGoals = [];
            $scope.theirAssists = [];
            $scope.theirTotals = [];
            $scope.theirSeasons =[];
            $scope.theirLeagues = [];
            $scope.theirAvShifts = [];
            $scope.theirAvHits = [];
            $scope.theirAvShots = [];
            $scope.theirAvBlocks = [];
            $scope.theirAvGoals = [];
            $scope.theirAvAssists = [];
            $scope.theirAvIceTime = [];
            $scope.shiftWidth = null;
            $scope.hitWidth = null;
            $scope.shotWidth = null;
            $scope.blocksWidth = null;
            $scope.shifts = null;
            $scope.hits = null;
            $scope.shots = null;
            
            
            
            $http.get("https://statsapi.web.nhl.com/api/v1/people/" + selectedPlayer + "?expand=person.stats&stats=yearByYear").success(function(data){
                
                $scope.selectedPlayerData = data;                
                $('#myModal').modal('show');
                $('[data-toggle="tooltip"]').tooltip(); 
                
                $scope.getGoals($scope.selectedPlayerData);
                
                
                
            }).error(function(){
                
               alert("There is an issue getting the data, you might be offline. You might be able to navigate to another team that you have already viewed though."); 
                
            });  
            
            var thisPlayer = $scope.playerIDs.indexOf(selectedPlayer);
            var rosterLength = $scope.playerIDs.length;
            
            if(thisPlayer === 0){
                $scope.nextPlayer = $scope.playerIDs[thisPlayer+1];
                $scope.prevPlayer = selectedPlayer;
                console.log($scope.playerIDs[thisPlayer+1]);
                
            }else {                
                if(thisPlayer === rosterLength-1){                    
                    $scope.nextPlayer = $scope.playerIDs[thisPlayer];
                    $scope.prevPlayer = $scope.playerIDs[thisPlayer-1];                    
                }else{                    
                    $scope.nextPlayer = $scope.playerIDs[thisPlayer+1];
                    $scope.prevPlayer = $scope.playerIDs[thisPlayer-1];
                }
            }           
            
            console.log("Roster is " +rosterLength+ " long " + thisPlayer + " (" +selectedPlayer+")" +" is the current player " + $scope.nextPlayer + " is next " + $scope.prevPlayer + " is previous");
            
        }
        
	}]);     
    app.directive("teamstats", function() {
        return {
            restrict : "E",
            scope: {
                id: "@",
                wins: "=",
                otw: "=",
                losses: "="
            },
            controller: ["$scope", function($scope){
                $scope.$watch("wins", function(){
                    var data = [
                      ['Wins', $scope.wins],
                      ['Over Time Losses', $scope.otw],
                      ['Losses', $scope.losses]
                    ];
                    Highcharts.chart($scope.id, {
                       chart: {
                            backgroundColor:"rgba(255,255,255,0)",
                            borderWidth: 0,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'column',
                            height:170,
                            //width:700,
                            margin: [20, 0, 20, 30]
                           
                        },
                        credits: {
                            enabled: false 
                        },
                        legend: {
                            enabled: false
                        },
                        title: {
                            text:null                            
                        },
                         xAxis: {
                            categories: ['Wins', 'OTL', 'Losses']
                        },
                        plotOptions: {
                            series:{
                                pointPadding: 0,
                                groupPadding: 0,
                                borderWidth: 0,
                                shadow: false
                            },
                            column:{
                                colors:["$A2","#607d8b","#263238"]
                            }
                        },
                        series: [{
                            name:'2018/2019',
                            type: 'column',                            
                            
                            animation: {
                                duration: 1000,
                                easing: 'easeOutBounce'
                            },                            
                            colorByPoint: true,
                            data: data
                        }]
                    }); 
                });  
            }]
        };
    }); 
    app.directive('lazyLoad', function(){
        return {
            restrict: 'A',
            scope: {
                image:"@"
            },
            link: function(scope, element, attrs){
                const observer = new IntersectionObserver(loadImg)
                const img = angular.element(element)[0];
                observer.observe(img);                
                function loadImg(changes){                    
                    changes.forEach(change => {
                        if(change.intersectionRatio > 0){
                            change.target.src = scope.image;
                            change.target.classList.remove('img-blur');
                        }
                    })
                }
            }
        }
    }); 
    app.filter("ordinal", function(){
        return function(number) {
            if(isNaN(number) || number < 1) {
                return number;
            } else {
                var lastDigit = number % 10,
                    lastDigit2 = number % 100;
                if (lastDigit == 1 && lastDigit2 != 11) {
                    return number + "st";
                }                
                if (lastDigit == 2 && lastDigit2 != 12) {
                    return number + "nd";
                }                
                if (lastDigit == 3 && lastDigit2 != 13) {
                    return number + "rd";
                }                
                return number + "th";                
            }
        };
    }); 
    app.filter('num', function() {
    return function(input) {
       return parseInt(input, 10);
    }});    
})();
