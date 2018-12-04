(function(){



	var app = angular.module('rosters', ["ui.router"]);
	app.controller('mainController', ['$http', '$scope', function($http, $scope){		
		$scope.players = [];     
        
        
        $scope.selectedTeam = 'https://statsapi.web.nhl.com/api/v1/teams/1?expand=team.roster&season=20182019';
        
        
        
        $http.get("https://statsapi.web.nhl.com/api/v1/teams").success(function(data){
            $scope.teamsData = data;
            console.log($scope.teamsData);
        }).error(function(){
            console.log("Can't get it!");
        });   
        
        
        
        $scope.playerPosition = "";
        
        $scope.playerPositionGroup = function(playerType){
            $scope.playerPosition = playerType;
            console.log($scope.playerPosition);
        };
        
        
        
        
        
        $http.get($scope.selectedTeam).success(function(data){
			 $scope.players = data;            
		}).error(function(){
			 alert("aint Loaing");
		});
        
        
        $scope.changeTeam = function(selectedTeam){
            $http.get($scope.selectedTeam).success(function(data){
			 $scope.players = data;
                console.log("fetched!");
                $scope.selectedPlayer = "";
                $scope.playerPosition = "";
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
})();
