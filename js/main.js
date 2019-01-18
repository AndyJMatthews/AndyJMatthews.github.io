(function(){
    


	var app = angular.module('rosters', ["ui.router"]);
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
            $("#tray, .trayback").toggleClass("closed");            
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
        
        $http.get("https://statsapi.web.nhl.com/api/v1/teams").success(function(data){
            $scope.teamsData = data;            
        }).error(function(){
            console.log("Can't get it!");
        });
        
        $scope.playerPosition = " ";
        
        $scope.playerPositionGroup = function(playerType){
            $scope.playerPosition = playerType;
            console.log($scope.playerPosition);
        };
        
        $http.get($scope.selectedTeam).success(function(data){
			 $scope.players = data;            
		}).error(function(){
			 alert("Selected Team Data ");
		});
        
        $http.get($scope.selectedTeamStats).success(function(data){
            $scope.teamStatsData = data;    
        }).error(function(){
            console.log("Team Stats not loading");
        });
        
        $scope.changeTeamStats = function(arg){
            
            console.log(arg);
            $http.get("https://statsapi.web.nhl.com/api/v1/teams/"+arg+"?hydrate=record(teamRecords)&season=20182019").success(function(data){
                console.log("got the team data....");
                $scope.teamStatsData = data;              
                
            }).error(function(){
                console.log("oh noes! Can't get team stats data!")
            });
            
            //http://statsapi.web.nhl.com/api/v1/teams/1?hydrate=record(teamRecords)&season=20182019
        };
        
        $scope.changeTeam = function(selectedTeam){
            $http.get("https://statsapi.web.nhl.com/api/v1/teams/"+selectedTeam+"?hydrate=roster(person(stats(splits=statsSingleSeason)))").success(function(data){
			 $scope.players = data;
                console.log("fetched!");
                //console.log($scope.players);
                
                
                $scope.selectedPlayer = "";
                $scope.playerPosition = "";
                $scope.teamID = $scope.players.teams[0].id;
                $scope.changeTeamStats($scope.teamID);
                
		      }).error(function(){
			 alert("You are offline, you might be able to navigate to another team that you have already viewed though.");
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
                    width:568
                },
                xAxis: {
                    categories: $scope.theirSeasons,
                        labels: {
                            formatter: function () {                            
                                return this.value.slice(0, 9);                            
                        }
                    }
                },
                
                series:[{
                    name: 'Goals',
                    data: $scope.theirGoals
                        
                },{
                    name: 'Assists',
                    data: $scope.theirAssists
                },{
                    name: 'total',
                    data: $scope.theirTotals
                }]
            });
            
        };
        $('#myModal').on('hidden.bs.modal', function (e) {
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
        });   
        
        
        $scope.getPlayer = function(selectedPlayer){
            $http.get("https://statsapi.web.nhl.com/api/v1/people/" + selectedPlayer + "?expand=person.stats&stats=yearByYear").success(function(data){
                $scope.selectedPlayerData = data;
                $scope.getGoals($scope.selectedPlayerData);
                $('#myModal').modal('show');
                $('[data-toggle="tooltip"]').tooltip();
                
                
            }).error(function(){
               alert("unable to locate player data"); 
            });  
                
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
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',
                            height:200,
                            width:200
                           
                        },
                        credits: {
                            enabled: false 
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom'
                        },
                        title: {
                            text: 'Team<br>Performance',
                            align: 'center',
                            verticalAlign: 'middle',
                            y: 0,
                            useHTML: true
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                colors: ["#cccccc", "#4f4f4f", "#000000"],
                                dataLabels: {
                                    enabled: false
                                },
                            }
                        },
                        series: [{
                            name:'2018/2019',
                            type: 'pie',                            
                            innerSize: '90%',
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
    }
});
})();
