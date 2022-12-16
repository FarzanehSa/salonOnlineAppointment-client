const ConfirmAddModal = ({onClose, msg, onConfirmAdd}) => {

  return (
    <div className='confirm-delete-appointment-modal'>
      <div className='confirm-msg'>
        <span>{msg}</span>
      </div>
      <div className="buttons">
        <button className="btn-cancel" onClick={() => onClose()} >Cancel</button>
        <button 
          className="btn-confirm"
          onClick={() => {
            onConfirmAdd();
            onClose();
            }}>
            Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmAddModal;