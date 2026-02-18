const GoogleMap = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#E6E2D8]">
      <iframe
        title="Google Maps"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d943.1936972950009!2d72.83008642494677!3d18.98555102620925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7af9f97d8bb63%3A0x90f17f565a332342!2sMaharashtra%20Medical%20Council!5e0!3m2!1sen!2sin!4v1771266585837!5m2!1sen!2sin"
        className="h-64 w-full sm:h-72 lg:h-80"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export default GoogleMap
