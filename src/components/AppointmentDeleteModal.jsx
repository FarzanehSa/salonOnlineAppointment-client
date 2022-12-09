const AppointmentDeleteModal = ({onClose, deleteApp, onConfirm}) => {

  return (
    <div className='confirm-delete-appointment-modal'>
      <div className='confirm-msg'>
        <div className="text">
          <span>Are you sure you want to cancel your appointment </span>
        </div>
        <div className="text">
          <span>on&nbsp;</span>
          <span className="date-time">{deleteApp.date.slice(0, 10)}&nbsp;</span>
          <span>at&nbsp;</span>
          <span className="date-time">{deleteApp.time}&nbsp;</span>
          <span>&nbsp;?</span>
        </div>
      </div>
      <div className="buttons">
        <button className="btn-cancel" onClick={() => onClose()} >Cancel</button>
        <button 
          className="btn-confirm"
          onClick={() => {
            onConfirm(deleteApp.id);
            onClose();
            }}>
            Confirm
        </button>
      </div>
    </div>
  )
}

export default AppointmentDeleteModal;