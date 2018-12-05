(function(){

var app = angular.module('teamstats', []); 
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
                
                setTimeout(function (){
                   var data = [
                      ['Wins', $scope.wins],
                      ['Over Time Wins', $scope.otw],
                      ['Losses', $scope.losses]
                    ];
                    console.log(data); 
                    
                    Highcharts.chart($scope.id, {
                       chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',
                            height:200,
                            width:200
                           
                        },
                        title: {
                            enabled: false,
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: false
                            }
                        },
                        series: [{
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
                },1000);  
            }]
        };
    }); 
})();