"use client";

import { FiMail, FiPhone, FiShield, FiUser } from "react-icons/fi";

const profile = {
  name: "Dr. Morgan",
  role: "Staff",
  email: "dr.morgan@treasure.care",
  phone: "+1 (555) 014-2280",
  department: "Clinical Counseling",
};

export default function ProfilePage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>My profile</h1>
          <p>View and manage your account details.</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-md border border-[#c1c9c0] bg-white shadow-[0_5px_20px_rgba(23,32,42,0.03)]">
        <div className="flex flex-col gap-6 border-b border-[#e8e8e5] px-6 py-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#2D5A3F] text-2xl font-bold text-white">
            DM
          </div>
          <div>
            <h2 className="m-0 font-serif text-2xl font-semibold text-[#1a1c1a]">
              {profile.name}
            </h2>
            <p className="mt-1 mb-0 text-sm text-[#414942]">{profile.role}</p>
          </div>
        </div>

        <dl className="m-0 grid gap-0 sm:grid-cols-2">
          <div className="flex items-start gap-3 border-b border-[#e8e8e5] px-6 py-4 sm:border-r">
            <FiUser className="mt-0.5 h-4 w-4 shrink-0 text-[#2D5A3F]" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#69746d]">
                Full name
              </dt>
              <dd className="mt-1 mb-0 text-sm font-medium text-[#1a1c1a]">
                {profile.name}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-[#e8e8e5] px-6 py-4">
            <FiShield className="mt-0.5 h-4 w-4 shrink-0 text-[#2D5A3F]" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#69746d]">
                Role
              </dt>
              <dd className="mt-1 mb-0 text-sm font-medium text-[#1a1c1a]">
                {profile.role}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-[#e8e8e5] px-6 py-4 sm:border-r sm:border-b-0">
            <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-[#2D5A3F]" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#69746d]">
                Email
              </dt>
              <dd className="mt-1 mb-0 text-sm font-medium text-[#1a1c1a]">
                {profile.email}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3 px-6 py-4">
            <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-[#2D5A3F]" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#69746d]">
                Phone
              </dt>
              <dd className="mt-1 mb-0 text-sm font-medium text-[#1a1c1a]">
                {profile.phone}
              </dd>
            </div>
          </div>
        </dl>

        <div className="border-t border-[#e8e8e5] bg-[#faf9f6] px-6 py-4 text-sm text-[#414942]">
          Department:{" "}
          <span className="font-semibold text-[#1a1c1a]">
            {profile.department}
          </span>
        </div>
      </section>
    </>
  );
}
