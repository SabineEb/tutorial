sap.ui.define([
    "com/systemagmbh/marquardtrainingplugin/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/ui/core/format/DateFormat"
], function (BaseController,
    JSONModel,
    MessageToast, Log, DateFormat) {
    "use strict";
    var oLogger = Log.getLogger("testPlugin", Log.Level.INFO);
    let podConfigs = {};
    let apis = {
        get_sfcDetails: "sfc/v1/sfcdetail",
        get_materialDetails: "material/v2/materials",
    }
    return BaseController.extend("com.systemagmbh.marquardtrainingplugin.controller.MainView", {
        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);
            podConfigs = this._getConfiguration();

            oLogger.info("onInit - podConfig: " + JSON.stringify(podConfigs));
            this.getView().byId("startButtonId").setVisible(podConfigs.startButtonVisible);
            this.getView().byId("stopButtonId").setVisible(podConfigs.stopButtonVisible);
            this.getView().byId("backendCallButtonId").setVisible(podConfigs.backendCallButtonVisible);

            this.preloadData();
        },

        formatDateTime: function (sDateTime) {
            // Create a date format instance with your desired format
            var oDateFormat = DateFormat.getDateTimeInstance({
                pattern: "dd.MM.yy HH:mm"
            });

            // Parse the input datetime string
            var oDate = new Date(sDateTime);

            // Format the date to your desired format
            var sFormattedDate = oDateFormat.format(oDate);

            return sFormattedDate;
        },

        updateView: function() {

           oData.items.push({
                id: 1,
                startTime: formatDateTime(new Date()),
                endTime:  formatDateTime(new Date()),
                material: this.getView().getModel("preloadData").getData().material
            });  
                
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "dataFromTimeTracking");  
        },

        updateStartTimeView: function() {

            if(this.getView().getModel("dataFromTimeTracking") != undefined) {
                var oData = this.getView().getModel("dataFromTimeTracking").getData();
            } else {
                var oData = {
                        items: []
                }
            }
                
            oData.items.push({
                    id: 1,
                    startTime: this.formatDateTime(new Date()),
                    endTime:  "",
                    material: this.getView().getModel("preloadData").getData().data.material
            });  
                    
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "dataFromTimeTracking");  
        },

        updateStopTimeView: function() {

            if(this.getView().getModel("dataFromTimeTracking") != undefined) {
                var oData = this.getView().getModel("dataFromTimeTracking").getData();
            } else {
                var oData = {
                    items: []
                }
            }

            oData.items.push({
                id: 1,
                endTime:  this.formatDateTime(new Date()),
                material: this.getView().getModel("preloadData").getData().data.material
            });  
                
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "dataFromTimeTracking");  
        },

        pressStopTimeButton: function() {
            this.updateStopTimeView();
        },

        pressStartTimeButton: function() {
            this.updateStartTimeView();
        },

        pressBackendCallButton: function() {

            var payload = {
                "plant": "PS_DEV",
                "startDateTime": new Date().toISOString(),
                "endDateTime": new Date().toISOString(),
                "resourceId": "RESOURCE_1"
              };
            
            if(this.getPodController() != undefined) {
                var url = this.getPodController()._oPodController.getPeRestDataSourceUri() +
                "api/v1/process/processDefinitions/start?key=" + podConfigs.key;
       
                 this.getPodController()._oPodController.ajaxPostRequest(url, payload,
                    function(oResponseData) {
                     console.log(oResponseData);
                    },
                   function(oError, sHttpErrorMessage) {
                     var err = oError || sHttpErrorMessage;
                     console.log(err);
                     MessageToast.show("ERROR");
                   }
                 );    
            } else {
                MessageToast.show("PodController not found");
            }
        },

        preloadData: function() {
			this.getMaterialDetails();
		},

        getMaterialDetails: function() {
            this.get(apis.get_materialDetails,{
                plant: this.getPlant(),
                material: this.getMaterial(),
            }).then(res=>{
                 var payload = { data: {
                        material: this.getMaterial(),
                        order: this.getOrder(),
                        sfc: this.getSfc(),
                        operation: "",
                        materialStatus: res.content[0].status,
                        lotSize: res.content[0].lotSize,
                        materialType: res.content[0].materialType
                    }
                 };
 
                 var oModel = new JSONModel(payload);
                 this.getView().setModel(oModel, "preloadData"); 
                 oLogger.info("getMaterialDetails - payload: " + JSON.stringify(payload));
            }).catch(x => {
             MessageToast.show("Error =" + x);
            })
        },

        onBeforeRenderingPlugin: function () {

            if(this.getPodController()) {
                this.subscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
                this.subscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
                this.subscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
            }
            
        },

        onAfterRendering: function () {
        },
        
        onAfterPodConfigsLoad: function (configs) {
        },

        isSubscribingToNotifications: function () {
            var bNotificationsEnabled = false;
            return bNotificationsEnabled;
        },

        getCustomNotificationEvents: function (sTopic) {
        },

        getNotificationMessageHandler: function (sTopic) {
            return null;
        },

        _handleNotificationMessage: function (oMsg) {
            var sMessage = "Message not found in payload 'message' property";
            if (oMsg && oMsg.parameters && oMsg.parameters.length > 0) {
                for (var i = 0; i < oMsg.parameters.length; i++) {

                    switch (oMsg.parameters[i].name) {
                        case "template":

                            break;
                        case "template2":
                    }
                }
            }

        },
        onBackButtonPress: function (oEvent) {
            MessageToast.show('Back Button Pressed!')
        },

        onExit: function () {
            if (BaseController.prototype.onExit) {
                BaseController.prototype.onExit.apply(this, arguments);
            }
            this.unsubscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
            this.unsubscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
            this.unsubscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
        },
        
        onPodSelectionChangeEvent: function (sChannelId, sEventId, oData) {
            oLogger.info("onPodSelectionChangeEvent: -> " + oData.selections);
        },

        onOperationChangeEvent: function (sChannelId, sEventId, oData) {
            // Step 1: Get the JSONModel instance
            var oModel = this.getView().getModel("preloadData");

            // Step 2: Get the current data from the model
            var oDataFromModel = oModel.getData();

            // Step 3: Change the desired property
            oDataFromModel.data.operation = oData.selections[0].operation;

            // Step 4: Set the modified data back to the model
            oModel.setData(oDataFromModel);

            oLogger.info("onOperationChangeEvent: -> " + oData.selections);
        },

        onWorkListSelectEvent: function (sChannelId, sEventId, oData) {
            oLogger.info("onWorkListSelectEvent: -> " + oData.selections);
        },
    });
});