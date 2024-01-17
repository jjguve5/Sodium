class ModalHandler{
    constructor(){
        this.currentModalId = "";
        this.modalStack = [];
    }

    openModal(modalId){
        if(this.currentModalId==modalId) return;

        if(!(document.getElementById(modalId))) return;

        const modal = document.getElementById(modalId);

        if(this.currentModalId!="") 
        {
            this.modalStack.push(this.currentModalId);
            const oldModal = document.getElementById(modalId);
            oldModal.classList.add("hide");
        }

        modal.classList.remove("hide");
        this.currentModalId=modalId;
    }

    closeModal(event) {
        if(this.currentModalId=="") return;
        const modalContent = document.querySelector(`#${this.currentModalId} .modal-content`);
        if (!modalContent.contains(event.target)) {
            this.closeCurrentModal();
        }
    }

    closeCurrentModal(){
        if(this.currentModalId=="" || !(document.getElementById(this.currentModalId))) return;

        document.getElementById(this.currentModalId).classList.add("hide");

        if(this.modalStack.length>0){
            document.getElementById(this.modalStack.pop()).classList.remove("hide");
        } else {
            this.currentModalId="";
        }
    }
}