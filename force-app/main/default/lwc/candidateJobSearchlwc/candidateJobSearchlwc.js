import { LightningElement,track,wire } from 'lwc';
import {
    APPLICATION_SCOPE,
    MessageContext,
    subscribe
} from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/candidateAppChannel__c';
import SideNaveFilterChannel from '@salesforce/messageChannel/SideNavFilters__c';
import cmpVisibilityChannel from '@salesforce/messageChannel/cmpVisibilityChannel__c';
import fetchData from '@salesforce/apex/JobController.getJobBySearchTerm';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {label:'Job Id',fieldName:'Name'},
    {label:'Position Name',fieldName:'jobLink',sortable:true,type:'url',typeAttributes: { label: { fieldName: 'Position__c' }, target: '_blank' }},
    {label:'Qualification',fieldName:'Qualification__c',sortable:true},
    {label:'Job Type',fieldName:'Job_Category__c',sortable:true},
    {label:'Experience',fieldName:'Experience_Level__c',sortable:true},
    {label:'Status',fieldName:'Status__c',sortable:true,type:'text',cellAttributes:{
        class:{fieldName:'statusColor'}
    }}
];
export default class CandidateJobSearchlwc extends LightningElement {
    /** job search component */
    @wire(MessageContext)
    messageContext;
    
    @track isVisible=true;
    @track searchTerm = '';
    @track jobs;
    @track columns = columns;
    @track pageNumber = 1;
    @track pageSize = 4;
    @track totalRecords = 0;
    @track sortedBy='';
    @track sortedDirection='asc';
    @track totalPages = 0;
    @track recordEnd = 0;
    @track recordStart = 0;
    @track isPrev = true;
    @track isNext = true;
    @track jobcategoryfilter = '';
    @track experiencefilter = '';
    @track sortbyfilter = '';
    wiredData;

    resolutionLessThan1280 = false;
    resolutionLessThan768 = false;
    resolutionGreaterThan1280 = false;
    tileSize='slds-size_1-of-2';

    pageLayoutChanged(){

        if (window.innerWidth < 768) {

            this.resolutionLessThan768 = true;
            this.tileSize = 'slds-size_1-of-1';
            console.log('Mobile');
            this.pageSize = 2;

        }

        else if (window.innerWidth >= 768 && window.innerWidth < 1280) { 

            this.resolutionLessThan1280 = true;
            this.tileSize = 'slds-size_1-of-2';
            console.log('Tablet');

        }

        else if(window.innerWidth >= 1280) {

            this.resolutionGreaterThan1280 = true;
            this.tileSize = 'slds-size_1-of-2';
            console.log('Desktop');

        }

    }


    connectedCallback(){
        this.subscribeToMessageChannel();
        this.pageLayoutChanged();
    }

    renderedCallback(){
        this.pageLayoutChanged();
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                messageChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }

        if(!this.subscriptionMC){
            this.subscriptionMC = subscribe(
                this.messageContext,
                SideNaveFilterChannel,
                (message) => this.handleMessage(message),
                {scope : APPLICATION_SCOPE}

            );
        }

        if(!this.subscriptionCM){
            this.subscriptionCM = subscribe(
                this.messageContext,
                cmpVisibilityChannel,
                (message) => this.handleMessage(message),
                {scope : APPLICATION_SCOPE}

            );
        }
    }

    handleMessage(message){
        console.log('subscribed message :'+JSON.stringify(message));
        console.log('message.componentName is '+message.componentName);
        if(message.componentName==="home"){
            this.isVisible = true;
        }
        else if(message.componentName==="appliedjob" || message.componentName==="contact" || message.componentName==="about"){
            console.log('setting isVisible as to false');
            this.isVisible = false;
        }


        if(message.queryterm!=null){
            this.searchTerm = message.queryterm;
            
        }

        if(message.sortfilters!=null){
            console.log(message.sortfilters);
            this.sortbyfilter = message.sortfilters;
        }

        if(message.experiencefilters!=null){
            console.log(message.experiencefilters);
            this.experiencefilter = message.experiencefilters;
        }

        if(message.jobcategoryfilters!=null){
            console.log(message.jobcategoryfilters);
            this.jobcategoryfilter = message.jobcategoryfilters;
        }

        this.refresh();
        
    }

    @wire(fetchData,{sortbypostingdatefilter:'$sortbyfilter',jobcategoryfilter:'$jobcategoryfilter',experiencefilter:'$experiencefilter',searchTerm:'$searchTerm',pageNumber:'$pageNumber',pageSize:'$pageSize',sortBy:'$sortedBy',sortDirection:'$sortedDirection' })
    wiredFetchData(result){
        //console.log('wire method called..');
        this.wiredData = result;
       // console.log('wired result :'+JSON.stringify(result));
        const {error,data} = result;
        if(data){
            
            // eslint-disable-next-line vars-on-top
            var resultData = JSON.parse(data);
            
            this.jobs = resultData.jobpositions;
            console.log('wire job data response : '+JSON.stringify(this.jobs));
            /*this.jobs = resultData.jobpositions.map(item=>{
                
                item.jobLink = '/' + item.Id;
                let statusColor = item.Status__c==='Closed'?"slds-text-color_error":"slds-text-color_success"
                return {...item,
                    "statusColor":statusColor
                }
                
            });*/
           
           // console.log('result data : '+JSON.stringify(this.jobs));
            this.pageNumber = resultData.pageNumber;
            this.totalRecords = resultData.totalRecords;
            this.recordStart = resultData.recordStart;
            this.recordEnd = resultData.recordEnd;
            this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
            this.isNext = (this.pageNumber === this.totalPages || this.totalPages === 0);
            this.isPrev = (this.pageNumber === 1 || this.totalRecords < this.pageSize);


        }else if(error){
            console.log('error occured: '+error);
        }

    }

    handlesort(event){

        this.sortedBy = event.detail.fieldName;

        this.sortedDirection = event.detail.sortDirection;
   
        this.refresh();
    }

    handleNext() {
        this.pageNumber = this.pageNumber + 1;
        this.refresh();
    }

    handlePrev() {
        this.pageNumber = this.pageNumber - 1;
        this.refresh();
    }

    handleRowClick(event){
        const rowData = event.detail.row;
        console.log('row clicked : '+ rowData);
    }

    navigateToSelectedJob(event){
        console.log('navigating to job page');
        const jobId = event.detail.jobId;
        console.log(jobId);
    }

    async refresh() {
       
        await refreshApex(this.wiredData);
     }
}