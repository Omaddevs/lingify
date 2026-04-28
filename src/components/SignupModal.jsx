import RegistrationModal from './RegistrationModal'

function SignupModal({ isOpen, onClose, onSubmit, onSwitchToLogin }) {
  return (
    <RegistrationModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      onSwitchToLogin={onSwitchToLogin}
    />
  )
}

export default SignupModal
