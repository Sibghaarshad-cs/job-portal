import {
  BriefcaseBusiness,
  MapPin,
  Mail,
  Phone,
  Globe,
  AtSign,
  Share2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-indigo-50 border-t border-gray-200">

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <BriefcaseBusiness className="text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                JobPortal
              </h2>

            </div>

            <p className="mt-5 text-gray-600 leading-7">
              Connecting talent with opportunity.
              <br />
              Helping professionals and employers
              build better careers together.
            </p>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-600" size={18} />
                <span>Islamabad, Pakistan</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-indigo-600" size={18} />
                <span>support@jobportal.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-indigo-600" size={18} />
                <span>+92 300 1234567</span>
              </div>

            </div>

          </div>

          {/* Connect */}

          <div>

            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Connect
            </h3>

            <div className="flex gap-4">

              <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                <Globe size={20} />
              </div>

              <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                <AtSign size={20} />
              </div>

              <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                <Share2 size={20} />
              </div>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Stay connected for new opportunities
              and platform updates.
            </p>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-gray-300 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>
            © 2026 JobPortal. All rights reserved.
          </p>

          <p>
            Empowering careers, one connection at a time.
          </p>

        </div>

      </div>

    </footer>
  );
}