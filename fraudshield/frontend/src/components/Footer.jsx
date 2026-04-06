const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">FraudShield</h3>
            <p className="text-slate-400 max-w-md">
              Stay safe from cyber threats. Report and search suspicious phone numbers, 
              UPI IDs, and URLs reported for fraud and scams.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/recent" className="hover:text-white transition-colors">Recent Reports</a></li>
              <li><a href="/report" className="hover:text-white transition-colors">Report Fraud</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Safety Tips</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Never share OTPs</li>
              <li>Verify UPI requests</li>
              <li>Check suspicious links</li>
              <li>Report fraud immediately</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-slate-400 mb-4">Report issues to admin@fraudshield.com</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-all">
                🛡️
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-all">
                📱
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-xs">
          © 2024 FraudShield. Built for cyber safety. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
