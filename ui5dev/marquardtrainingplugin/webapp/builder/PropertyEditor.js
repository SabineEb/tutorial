sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "com.systemagmbh.marquardtrainingplugin.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			
			this.setI18nKeyPrefix("customComponentListConfig.");
			this.setResourceBundleName("com.systemagmbh.marquardtrainingplugin.i18n.builder");
			this.setPluginResourceBundleName("com.systemagmbh.marquardtrainingplugin.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
				
			this.addSwitch(oPropertyFormContainer, "backButtonVisible", oData);
			this.addSwitch(oPropertyFormContainer, "closeButtonVisible", oData);
			this.addSwitch(oPropertyFormContainer, "backendCallButtonVisible", oData);
			
			this.addInputField(oPropertyFormContainer, "key", oData);			
			this.addInputField(oPropertyFormContainer, "title", oData);
			this.addInputField(oPropertyFormContainer, "inputfield", oData);

            oFormContainer = oPropertyFormContainer;
		},
		
		getDefaultPropertyData: function(){
			return {
				
				"backButtonVisible": true,
				"closeButtonVisible": true,
				"backendCallButtonVisible": true,
				"key": "123",  
                "title": "testplugin",
				"inputfield": "Das ist ein Test"    
			};
		}

	});
});