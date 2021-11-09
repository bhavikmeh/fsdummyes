sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("bh.fsdummyes.controller.saleshdr", {
        onInit: function(){
            debugger;
            this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRoutePatternMatched(this.setSalesid,this);
        },
        setSalesid: function(oEvent){
               debugger;
               this.sObjectId =  oEvent.getParameter("arguments").objectId;
               this.soId = oEvent.getParameter("arguments").soId;
               this.soItm = oEvent.getParameter("arguments").soItm;

               var sObjectPath = this.getModel().createKey("SalesOrderLineItemSet",
                {					
                    SalesOrderID:    this.soId,
                    ItemPosition:   this.soItm
                });
                this.getView().bindElement("/" + sObjectPath + "/" + "ToHeader");
        },
        onF4:function(oEvent){
            debugger;
            this.F4BuCell = oEvent.getParameter("id");
            if (!this.BuF4Popup) {
                    this.BuF4Popup = new sap.ui.xmlfragment("bh.fsdummyes.fragment.f4bu", this)
                    this.BuF4Popup.setTitle("Select City");
                    // Add dependent this will make the model availabe in the Pop up because
                    // Popup is Seperate API called outside App view, other option is
                    // this.BuF4Popup.setModel(this.getView().getModel());
                    this.getView().addDependent(this.BuF4Popup);
                    // Next we will Dynamically add Standard List in the pop up
                    this.BuF4Popup.bindAggregation("items", {
                        path: "/BusinessPartnerSet",
                        template: new sap.m.StandardListItem("idSList", {
                            title: "{CompanyName}",
                            description: "{BusinessPartnerID}"                            
                        })
                    });
                    this.BuF4Popup.attachConfirm(this.onBuConfirm, this);
                    // this.BuF4Popup.attachSearch(this.onSearchCity, this);
                }
                this.BuF4Popup.open();
        },
        onBuConfirm:function(oEvent){
            debugger;
            // Step 1
            var oItem = oEvent.getParameter("selectedItem");
            sap.ui.getCore().byId(this.F4BuCell).setValue(oItem.getDescription());
            var odatt = this.getView().getModel().getProperty("/BusinessPartnerSet(\'" + oItem.getDescription() + "\')" );
            
            this.getView().byId("countryText").setText(odatt.CompanyName);   

            // Or Step2
            var osale = this.getView().getModel().getProperty("/SalesOrderSet(\'0500000000\')");
            osale.CustomerName = odatt.CompanyName;
            this.getView().getModel().setProperty("/SalesOrderSet(\'0500000000\')",osale);


        }
    });
});