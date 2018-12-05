(function(){



	var app = angular.module('rosters', ["ui.router"]);
	app.controller('mainController', ['$http', '$scope', function($http, $scope){		
		$scope.players = [];     
        
        
        $scope.selectedTeam = 'https://statsapi.web.nhl.com/api/v1/teams/24?expand=team.roster&season=20182019';
        
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
            $http.get($scope.selectedTeam).success(function(data){
			 $scope.players = data;
                console.log("fetched!");
                $scope.selectedPlayer = "";
                $scope.playerPosition = "";
                $scope.teamID = $scope.players.teams[0].id;
                $scope.changeTeamStats($scope.teamID);
                $scope.chart();
                
		      }).error(function(){
			 alert("aint Loaing");
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
        
        
        
        // players
        $scope.selectedPlayer = "";
        $scope.theirGoals = [];
        
        $scope.getGoals = function(selectedPlayerData){
            
        };        
        $scope.getPlayer = function(selectedPlayer){
            $http.get("https://statsapi.web.nhl.com/api/v1/people/" + selectedPlayer + "?expand=person.stats&stats=yearByYear").success(function(data){
                $scope.selectedPlayerData = data;
                $scope.getGoals($scope.selectedPlayerData);
                $('#myModal').modal('show');                
                
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
                      ['Over Time Wins', $scope.otw],
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
                            innerSize: '60%',
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
})();
