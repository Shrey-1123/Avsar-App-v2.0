import { LightningElement,api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class Jobtile extends LightningElement {

    @api
    job; // coming from parent
    @api
    selectedJobId; // sending from this component to parent cmp
    @api
    isJobSaved; // coming from parent

    jobSaved; // scoped within this component
    linkName = 'View More';
    description;

    renderedCallback(){
        console.log('job coming from parent: '+this.job);
        this.description = this.job.Job_Description__c;
    }

     // Getter for dynamically setting the background image for the picture
     get backgroundStyle() {
        return 'background-image:url('+ this.job.ImageURL__c +')';
    }

    get tileClass() {
        if (this.job.Id === this.selectedJobId) {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }

     // Fires event with the Id of the job that has been selected.
     selectJob() {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.selectedJobId = this.job.Id;
        const jobselect = new CustomEvent('jobselect', {
            detail: {
                jobId: this.selectedJobId
            }
        });
        this.dispatchEvent(jobselect);
    }

    viewMore() {
        if(this.linkName === 'View More') {
            this.template.querySelector('.content').classList.remove('slds-line-clamp_small');
            this.linkName = 'View Less';
        } else {
            this.template.querySelector('.content').classList.add('slds-line-clamp_small');
            this.linkName = 'View More';
        }        
    }
}