import { Share2 } from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

const volunteers = [
  {
    name: 'Robart Jonson',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
    color: '#18bd72',
  },
  {
    name: 'Leslie Alexander',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    color: '#ff4b42',
  },
  {
    name: 'Kristin Watson',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    color: '#ffb52e',
  },
  {
    name: 'Ronald Richards',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    color: '#ff4b42',
  },
  {
    name: 'Albert Flores',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
    color: '#18bd72',
  },
  {
    name: 'Eleanor Pena',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    color: '#ffb52e',
  },
  {
    name: 'Devon Lane',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    color: '#18bd72',
  },
  {
    name: 'Jenny Wilson',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    color: '#ff4b42',
  },
  {
    name: 'Cody Fisher',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=900&q=80',
    color: '#ffb52e',
  },
];

export default function VolunteersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-2xl font-extrabold italic text-[#ff4b42]">Our Volunteers</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2d32] md:text-5xl">
              Meet With Volunteers
            </h1>
            <div className="mx-auto mt-2 h-3 w-52 rounded-[50%] border-b-4 border-[#ffb52e]" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {volunteers.map((volunteer) => (
              <article key={volunteer.name} className="overflow-hidden rounded bg-white">
                <div className="relative h-[395px] overflow-hidden">
                  <img
                    src={volunteer.image}
                    alt={volunteer.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <button
                    className="absolute bottom-0 left-0 grid h-20 w-20 place-items-center text-white"
                    style={{ backgroundColor: volunteer.color }}
                    aria-label={`Share ${volunteer.name}`}
                  >
                    <Share2 className="h-7 w-7" />
                  </button>
                </div>
                <div
                  className="rounded-b px-6 py-8 text-center text-white"
                  style={{ backgroundColor: volunteer.color }}
                >
                  <h2 className="text-3xl font-extrabold">{volunteer.name}</h2>
                  <p className="mt-2 text-xl">{volunteer.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
