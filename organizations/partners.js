Parse.initialize("BbjrthNLZ49b6pQ1hvYCUc9RATqUleRw4on1uPwV", "WjBd5QzC1t5Q6JnEuI4uJU38tkL7h5PzUzZnhmxO");

//Define an angular module for our app
var sampleApp = angular.module('sampleApp', ['ngRoute'])
.run(['$rootScope', function($scope) {
  $scope.currentUser = Parse.User.current();
 
  $scope.signUp = function(form) {
    var user = new Parse.User();
    user.set("email", form.email);
    user.set("username", form.username);
    user.set("password", form.password);
 
    user.signUp(null, {
      success: function(user) {
        $scope.currentUser = user;
        $scope.$apply(); // Notify AngularJS to sync currentUser
      },
      error: function(user, error) {
        alert("Unable to sign up:  " + error.code + " " + error.message);
      }
    });    
  };
 
  $scope.logIn = function(form) {
      
  Parse.User.logIn(form.username, form.password, {
        success: function(user) {
           $scope.currentUser = user;
           $scope.$apply(); // Notify AngularJS to sync currentUser
         },
        error: function(user, error) {
           alert("Unable to sign up:  " + error.code + " " + error.message);
         }
    });
   
  };
 
  $scope.logOut = function(form) {
    Parse.User.logOut();
    $scope.currentUser = null;
  };
}]);

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
sampleApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/Home', {
            templateUrl: 'views/loginView.html',
            controller: 'AddOrderController'
        }).
        when('/Reports', {
            templateUrl: 'views/viewReports.html',
            controller: 'ShowOrdersController'
        }).
        when('/Motions', {
            templateUrl: 'views/helpMotions.html',
            controller: 'ShowOrdersController'
        }).
        when('/Feedback', {
            templateUrl: 'views/sendFeedback.html',
            controller: 'questionController'
        }).
        when('/Clients', {
            templateUrl: 'views/NewClient.html',
            controller: 'RecordsController'
        }).
        when('/Clients/:clientId', {
            templateUrl: 'views/viewClientDetails.html',
            controller: 'showQuestionController'
        }).
   
        when('/Motions', {
            templateUrl: 'views/helpMotions.html',
            controller: 'showQuestionController'
        }).
        otherwise({
            redirectTo: '/Home'
        });
  }]);

sampleApp.controller('AddOrderController', function ($scope) {

    $scope.message = 'Add a New Question';



    $scope.saveQuestion = function () {

        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;       
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        var showM = $scope.currentQuestion.showMisdemeanors;

        console.log("set up variables");
        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        var answer = [];

        // get all answers
        for (var i = 0; i < $scope.currentQuestion.answers.length; i++) {

            var newAtext = $scope.currentQuestion.answers[i].answerText;
            var newAnext = $scope.currentQuestion.answers[i].next;
            var newAnswer = { "answerText": newAtext, "next": newAnext };

            // append new value to the array
            answer.push(newAnswer);
        }

        question.set("answers", answer);
        console.log("about to save");
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('New object created with objectId: ' + question.id);

            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

});

sampleApp.controller('ShowOrdersController', function ($scope, $routeParams) {

    $scope.message = 'This is Show orders screen';

});

sampleApp.factory('sharedService', function ($rootScope) {
    //http://onehungrymind.com/angularjs-communicating-between-controllers/

    var sharedService = {};

    sharedService.currentquestion = {};
    sharedService.message = '';

    sharedService.prepForUpdate = function (msg, question) {
        this.message = msg;
        this.currentquestion = question;
        this.updateCurrentQuestion();

        console.log("in prep for update:  " + msg);
    };
    sharedService.updateCurrentQuestion = function () {
        $rootScope.$broadcast('updateQuestion');
        console.log("after broadcast prep for update:  " + this.message);
    };

    return sharedService;
});

sampleApp.factory('Question', function ($q) {

    var Question = Parse.Object.extend("testquestions", {
        // Instance methods
    }, {
        // Class methods
        listQuestions: function ($scope) {
            var defer = $q.defer();

            var query = new Parse.Query(this);
            query.find({
                success: function (aQuestions) {
                    //alert("Successfully retrieved " + aQuestions.length + " questions.");
                    defer.resolve(aQuestions);
                    $scope.$apply();
                },
                error: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        }
    });


    // Question properties
    Question.prototype.__defineGetter__("objectId", function () {
        return this.get("objectId");
    });
    Question.prototype.__defineSetter__("objectId", function (aValue) {
        return this.set("objectId", aValue);
    });
    
    Question.prototype.__defineGetter__("questionID", function () {
        return this.get("questionID");
    });
    Question.prototype.__defineSetter__("questionID", function (aValue) {
        return this.set("questionID", aValue);
    });

    Question.prototype.__defineGetter__("questionText", function () {
        return this.get("questionText");
    });
    Question.prototype.__defineSetter__("questionText", function (aValue) {
        return this.set("questionText", aValue);
    });

    Question.prototype.__defineGetter__("helperText", function () {
        return this.get("helperText");
    });
    Question.prototype.__defineSetter__("helperText", function (aValue) {
        return this.set("helperText", aValue);
    });

    Question.prototype.__defineGetter__("showMisdemeanors", function () {
        return this.get("showMisdemeanors");
    });
    Question.prototype.__defineSetter__("showMisdemeanors", function (aValue) {
        return this.set("showMisdemeanors", aValue);
    });

    Question.prototype.__defineGetter__("answers", function () {
        return this.get("answers");
    });
    Question.prototype.__defineSetter__("answers", function (aValue) {
        return this.set("answers", aValue);
    });

    Question.prototype.__defineGetter__("Section", function () {
        return this.get("Section");
    });
    Question.prototype.__defineSetter__("Section", function (aValue) {
        return this.set("Section", aValue);
    });


    return Question;
});

//http://stackoverflow.com/questions/13882077/angularjs-passing-scope-between-routes
sampleApp.factory("currentQuestion", function (){
return {};
});

sampleApp.controller('questionController', function ($scope, $http, $location, sharedService, Question, currentQuestion) {

    Question.listQuestions($scope).then(function (aQuestions) {
        $scope.questions = aQuestions;
        console.log("number of questions:  " + $scope.questions.length)
    },
    function (aError) {
        // Something went wrong, handle the error
    });

    $scope.showQuestion = function (question) {   
        var path = '/Questions/' + question.questionID;
        $scope.currentQuestion = question;        
        sharedService.prepForUpdate("clicked", question);

        //http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
        $location.path(path);
    }
    function getQuestion(questionID)
    {
        for (q in questions)
        {
            if (questions[q].questionID == questionID) {
                return questions[q];
            }
        }
    }
   

});


sampleApp.controller('RecordsController', function ($scope, $routeParams, sharedService) {
    
        //Initialize form with basic data for person
        $scope.person = {};
        $scope.person.first = "John";
        $scope.person.middle = "Jay";
        $scope.person.last = "Smith";
        $scope.person.phone = "2022225555";
        $scope.person.email = "test@email.com";
        $scope.person.address1 = "1600 pennsylvania ave NW";
        $scope.person.address2 = "Washington, DC, 20002";
        $scope.person.dobMonth = "10";
        $scope.person.dobDay = "05";
        $scope.person.dobYear = "2015";
        $scope.person.pendingCase = false;    
        $scope.records = [];
        $scope.convictions = [];
        $scope.hasMDQconvictions = false;
     
        $scope.addRecordItem = function () 
        
        {
         $scope.newRecord.expanded = false;
        
            if(!($scope.newRecord.dispDate.month == null) && !($scope.newRecord.dispDate.day == null) && !($scope.newRecord.dispDate.year == null))
            {   
            $scope.newRecord.dispDate.full = $scope.newRecord.dispDate.month + "/" + $scope.newRecord.dispDate.day + "/" + $scope.newRecord.dispDate.year;
            $scope.newRecord.fullDate = new Date($scope.newRecord.dispDate.full);
            }
            
             if($scope.newRecord.convictionStatus === 'Conviction')
             {
                 //Maintain list of convictions
                 var newConviction = {};
                 newConviction.itemType = $scope.newRecord.itemType;
                 newConviction.convictionStatus = $scope.newRecord.convictionStatus;
                 newConviction.offDate = $scope.newRecord.dispDate;
                 newConviction.eligibilityDate = $scope.newRecord.dispDate;
                 
                 if($scope.newRecord.itemType === 'Felony' && $scope.newRecord.felonyType === 'Ineligible')
                 {
                    newConviction.eligibilityDate.year = (parseInt($scope.newRecord.dispDate.year) + 10).toString();
                    $scope.hasMDQconvictions = true;
                 }
                 else if($scope.newRecord.itemType === 'Misdemeanor')
                 {
                    newConviction.eligibilityDate.year = (parseInt($scope.newRecord.dispDate.year) + 5).toString();
                    
                    if($scope.newRecord.MisdemeanorType === 'Ineligible')
                        $scope.hasMDQconvictions = true;
                 }
                 
                 console.log(newConviction);
                 $scope.convictions.push(newConviction);
            }
            
            
            $scope.records.push($scope.newRecord);
            $scope.checkEligibility();
           
            console.log($scope.newRecord);
           
            $scope.newRecord = {};
        }
     
      $scope.findDConvictions = function (startDate) {
     //This function will search the convictions array looking for a disquailifying convictions for 16-803c2
       var disqualified = false;
      
      angular.forEach($scope.convictions, function(item)
        {
            if(parseInt(item.offDate.year) > parseInt(startDate.year))
                disqualified = true;  
            else if(parseInt(item.offDate.year) === parseInt(startDate.year) 
            && parseInt(item.offDate.month) > parseInt(startDate.month))
              disqualified = true;  
        });
        
        return disqualified;
     }
     
     $scope.findConvictionDate = function () {
     //This function will search the convictions array looking for the most recent expiration date
        var expirationDate = {};
      
      angular.forEach($scope.convictions, function(item)
        {
            if(expirationDate === {})
            {
                expirationDate = item.eligibilityDate;
            }
            else if(parseInt(expirationDate.year) > parseInt(item.eligibilityDate.year))
            {
                expirationDate = item.eligibilityDate;
            }
            else if(parseInt(expirationDate.year) === parseInt(item.eligibilityDate.year)
            && parseInt(expirationDate.month) < parseInt(item.eligibilityDate.year))
            {
                expirationDate = item.eligibilityDate;
            }
        });
        
        return expirationDate;
     }
     
        $scope.checkEligibility = function () {
         
         //This variable will hold the earliest date for eligibility sealing
         var convictionEligibilityDate = {}; 
         
         if($scope.convictions.length > 0);
            convictionEligibilityDate = $scope.findConvictionDate();
         
        angular.forEach($scope.records, function(item)
        {
            var eligibilityDate = item.dispDate;
            item.eligibility = '';
            item.justifications = [];
                    
            if($scope.person.pendingCase === true)
            {
                item.eligibility = 'Ineligible - Due to Pending Case';
                eligibilityDate.year = 0;
                
                var newJustifications = {};
                newJustifications.explanation = "Your pending case must be completed before you can seal.";
                newJustifications.lawCode = "16-801(5)(B)";
                newJustifications.exception = "N/A";
                item.justifications.push(newJustifications);
            }
            
            if(item.convictionStatus === 'Conviction' &&  item.itemType === 'Felony' &&  item.FelonyType === 'Ineligible')
            {
                 item.eligibility = 'Ineligible - Felony Conviction';
                 eligibilityDate.year = 0;
                 
                var newJustifications = {};
                newJustifications.explanation = "Ineligible Felonies are never eligible unless Bail Reform Act.";
                newJustifications.lawCode = "N/A";
                newJustifications.exception = "N/A";
                item.justifications.push(newJustifications);
           
            }
            else if(item.convictionStatus === 'Non-Conviction' &&  item.itemType === 'Felony')
            {
                if(item.papered === 'No')
                {
                    eligibilityDate.year = (parseInt(item.dispDate.year) + 3);

                    var newJustifications = {};
                    newJustifications.explanation = "You can seal this crime three years since off papers";
                    newJustifications.lawCode = "16-803(b)(1)(A)";
                    newJustifications.exception = "N/A";   
                    item.justifications.push(newJustifications);
                }
                else if(item.papered === 'Yes')
                {
                    eligibilityDate.year = (parseInt(item.dispDate.year) + 4);
                 
                    var newJustifications = {};
                    newJustifications.explanation = "You can seal this crime four years since off papers";
                    newJustifications.lawCode = "16-803(b)(1)(A)";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
                }
                
                if($scope.convictions.length > 0 && parseInt(convictionEligibilityDate.year) > parseInt(eligibilityDate.year))
                 {
                     
                    eligibilityDate = convictionEligibilityDate;       
                    
                    var newJustifications = {};
                    newJustifications.explanation = "Your conviction adds 5 - 10 years to waiting period.";
                    newJustifications.lawCode = "16-803(b)(2)(A)/(B)";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
                 }               }
                
            
            else if(item.convictionStatus === 'Conviction' &&  item.itemType === 'Misdemeanor' && item.MisdemeanorType === 'Ineligible')
            {
                 item.eligibility = 'Ineligible - Misemeanor Conviction';
                 eligibilityDate.year = 0;
        
                var newJustifications = {};
                newJustifications.explanation = "Ineligible Misdemeanor Convictions are never eligible for sealing.";
                newJustifications.lawCode = "16-803(c)";
                newJustifications.exception = "N/A";
                item.justifications.push(newJustifications);
             }
            else if(item.convictionStatus === 'Conviction' &&  item.itemType === 'Misdemeanor' && item.MisdemeanorType === 'Eligible')
            {
                if(($scope.hasMDQconvictions) || $scope.findDConvictions(item.dispDate))
                {  
                    item.eligibility = 'Ineligible due to another Conviction';
                    eligibilityDate.year = 0;
                    
                    var newJustifications = {};
                    newJustifications.explanation = "This can never be sealed due to another conviction on your record.";
                    newJustifications.lawCode = "16-801(5)(c)";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
                }
                else if (5 < 4) //Must add logic to check for any convictions after current conviction
                {
                    var newJustifications = {};
                    newJustifications.explanation = "This can never be sealed due to a subsequent conviction on your record.";
                    newJustifications.lawCode = "16-803(c)(2); 16-801(5)(A) ";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
                }
                else
                {
                    eligibilityDate.year = (parseInt(item.dispDate.year) + 8);

                    var newJustifications = {};
                    newJustifications.explanation = "This can be sealed after an 8 year waiting period.";
                    newJustifications.lawCode = "16-801(5)(c)";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
                }}
            
            else if(item.convictionStatus === 'Non-Conviction' &&  item.itemType === 'Misdemeanor' &&  item.MisdemeanorType === 'Eligible')
            {
                 
                if($scope.convictions.length > 0 && parseInt(convictionEligibilityDate.year) > parseInt(eligibilityDate.year))
                {      
                    eligibilityDate = convictionEligibilityDate;  
                   
                    var newJustifications = {};
                    newJustifications.explanation = "Your other conviction will add 5-10 years to the waiting period.";
                    newJustifications.lawCode = "16-803(a)(2)(A) ; 16-803(a)(2)(B)";
                    newJustifications.exception = "N/A";
                    item.justifications.push(newJustifications);
    
                } 
                else
                {
                    eligibilityDate.year = (parseInt(item.dispDate.year) + 2);
                 
                    var newJustifications = {};
                    newJustifications.explanation = "Your eligible misdemeanor conviction can be sealed after a 2 year waiting period.";
                    newJustifications.lawCode = "16-803(a)(1)(A)";
                    newJustifications.exception = "If non-conviction because Deferred Sentencing Agreement, cannot be expunged if you have any misdemeanor or felony conviction";
                    item.justifications.push(newJustifications);        } 
        }
            
            else if(item.convictionStatus === 'Non-Conviction' &&  item.itemType === 'Misdemeanor' &&  item.MisdemeanorType === 'Ineligible')
            {
                if(item.papered === 'No')
                {                    
                    if($scope.convictions.length > 0 && parseInt(convictionEligibilityDate.year) > parseInt(eligibilityDate.year))
                    {
                        eligibilityDate = convictionEligibilityDate;     
                        
                        var newJustifications = {};
                        newJustifications.explanation = "This can never be sealed due to a subsequent conviction on your record.";
                        newJustifications.lawCode = "16-803(b)(2)(A); 16-803(b)(2)(B) ";
                        newJustifications.exception = "N/A";
                        item.justifications.push(newJustifications);
                    }
                    else
                    {
                        eligibilityDate.year = (parseInt(item.dispDate.year) + 3);
                        
                            var newJustifications = {};
                        newJustifications.explanation = "This misdemeanor can be sealed after a 3 year waiting period.";
                        newJustifications.lawCode = "16-803(b)(1)(A)";
                        newJustifications.exception = "If non-conviction because Deferred Sentencing Agreement, cannot be expunged if you have any misdemeanor or felony conviction";
                
                        item.justifications.push(newJustifications);
                    }
                }
                else if(item.papered === 'Yes')
                {
                    
                    if($scope.convictions.length > 0 && parseInt(convictionEligibilityDate.year) > parseInt(eligibilityDate.year))
                 {   	    
                     eligibilityDate = convictionEligibilityDate;
                     
                item.explanation = "Your pending case must be completed before the court will allow you to seal.";
                item.lawCode = "16-801(5)(B)";
                item.exception = "N/A";   
                } 
                else
                {
                   eligibilityDate.year = (parseInt(item.dispDate.year) + 4);
                   
                item.explanation = "Your pending case must be completed before the court will allow you to seal.";
                item.lawCode = "16-801(5)(B)";
                item.exception = "N/A";
                     
                }   
                }
            }
            else
            {
                item.eligibility = 'Pending';
                
                item.explanation = "Your pending case must be completed before the court will allow you to seal.";
                item.lawCode = "16-801(5)(B)";
                item.exception = "N/A";
            }
            
            if(item.eligibility === '' && parseInt(eligibilityDate.year) > 0)
            {
                item.eligibility = 'Eligible for sealing in ' + eligibilityDate.year;
                
                
                if(new Date().getFullYear() >= parseInt(eligibilityDate.year) )
                    item.resultClass = "success";
                else
                    item.resultClass = "warning";
                    
                    console.log(new Date().getFullYear() <= parseInt(eligibilityDate.year) );
                    console.log(new Date().getFullYear());
                    console.log(parseInt(eligibilityDate.year) );
                
            }
            else
            {
                item.resultClass = "danger";
            }
            
            
            console.log(item);
        });
         
         console.log($scope.records);
        }
     
        $scope.dispositionOptions = [
            { title: 'No Papered', description: 'After an arrest, but before presentment (for felonies) or arraignment on the information (for misdemeanors), the United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia has declined to proceed with the prosecution. This means that your a1Test has been NO PAPERED. However, the Government can proceed with prosecution at a later date.","There is no PUBLIC record of your arrest in the Court\'s database, although there is an arrest record. An arrest record is a record in the law enforcement database that contains your name, date of your arrest, the charges for which you were arrested, and other personal information such as your date of birth. An arrest record is not a conviction. However, if you apply for a job the arrest information may be disclosed to potential employees.'},
            { title: 'Acquitted', description: 'The legal and formal certification of the innocence of a person who has been charged with a crime. A finding of not guilty.' },
            { title: 'Dismissed for Want of Prosecution', description: 'An order or judgment disposing of the charge(s) without a trial. An involuntary dismissal accomplished on the Court\'s own motion for lack of prosecution or on motion from the defendant for Jack of prosecution or fai lure to introduce evidence of facts on which relief may be granted. The dismissal is without prejudice which allows the prosecutor the right to rebring the charge(s) at a later date.' },
            { title: 'Dismissal', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia filed a Dismissal for the incident that lead to the arrest. This means that after an indictment was returned, the court entered a dismissal at the request of the Government prior to commencement of the trial, or the court entered a dismissal after making its own finding that there was an unnecessary delay by the Government in presenting the case. Dismissals are without prejudice unless  otherwise stated.' },
            { title: 'Found Guilty - Plea', description: 'Formal admission in court as to guilt of having committed the criminal act(s) charged, which a defendant may make if he or she does so intell igently and voluntarily. It is binding and is equivalent to a conviction after trial. A guilty plea has the same effect as a verdict of guilty and authorizes imposition of the punishment prescribed by law.' },
            { title: 'Non Jury Trial Guilty', description: 'Trial was held before a Judge, without a jury. At the conclusion of trial, the Judge found that the Government has met its burden of proof and it is beyond a reasonable doubt that the defendant is guilty of the offense(s) charged.' },
            { title: 'Non Jury Trial Not Guilty', description: 'Trial was held before a Judge, without a jury. At the conclusion of trial, the Judge found that the Government has failed to meet its burden of proof to show that the defendant was guilty of the offense(s) charged beyond a reasonable doubt.' },
            { title: 'Jury Trial Not Guilty', description: 'Formal pronouncement by a jury that they find the defendant not guilty of the offense(s) charged.' },
            { title: 'Jury Trial Guilty', description: 'Formal pronouncement by a jury that they find the defendant guilty of the offense(s) charged. ' },
            { title: 'Post and Forfeit', description: 'The Metropolitan Police Department (MPD) or the Office of the Attorney General for the District of Columbia has resolved the incident that leads to your arrest using the Post and Forfeit procedure.,The Post and Forfeit procedure allows a person charged with certain offenses to post and forfeit an amount as collateral (which otherwise would serve as security upon release to ensure the arrestee\'s appearance at trial) and thereby obtain a full and final resolution of the offense. The agreement to resolve the offense using the Post and Forfeit procedure is final.' },
            { title: 'Nolle Diversion', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia has agreed that it will no longer pursue prosecution in this case because the defendant has complied with the conditions of his/her release as ordered by the Court' },
            { title: 'Nolle Prosequi', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia filed a Nolle Prosequi for the incident that lead to the arrest. This means that the Government has decided that it will no longer pursue prosecution in this case. ' }
        ];
    });
  
sampleApp.controller('showQuestionController', function ($scope, $routeParams, sharedService) {
    
    $scope.message = 'Edit Questions';    
    $scope.currentQuestion = sharedService.currentquestion;    

    $scope.saveQuestion = function () {

        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        var showM = $scope.currentQuestion.showMisdemeanors.toString();
        console.log(showM);
        console.log("set up variables");

        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        question.set("answers", $scope.currentQuestion.answers);

        console.log("about to save");
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('New object created with objectId: ' + question.id);

            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

    $scope.updateQuestion = function () {

        var objectID = $scope.currentQuestion.id;

        console.log("objcet Id:" + objectID);
        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        //var showM = ($scope.currentQuestion.showMisdemeanors);//.toString();
        var showM = $scope.currentQuestion.showMisdemeanors;
        console.log(showM);
        console.log("set up variables");

        question.set("objectId", objectID);
        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        var answer = [];

        // get all answers
        for (var i = 0; i < $scope.currentQuestion.answers.length; i++) {

            var newAtext = $scope.currentQuestion.answers[i].answerText;
            var newAnext = $scope.currentQuestion.answers[i].next;
            var newAnswer = { "answerText": newAtext, "next": newAnext };

            // append new value to the array
            answer.push(newAnswer);
        }
        
        question.set("answers", answer);

        console.log("about to save");
        console.log(question);
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('Question Updated: ' + question.id);


            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

    $scope.addAnswerToModel = function () {
        var newAtext = $scope.newAnswer.answerText;
        var newAnext = $scope.newAnswer.next;

        var newAnswer = { "answerText": newAtext, "next": newAnext };

        // append new value to the array
        $scope.currentQuestion.answers.push(newAnswer);

        //Clear items in new answer form
        $scope.newAnswer.answerText = '';
        $scope.newAnswer.next = '';
    }

    function loadQuestion()
    {

    }
  
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


