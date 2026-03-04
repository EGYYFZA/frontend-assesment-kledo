import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Globe2, FilterX, Map, Building2, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

type Province = { id: number; name: string };
type Regency = { id: number; name: string; province_id: number };
type District = { id: number; name: string; regency_id: number };

type RegionsData = {
  Provinces: Province[];
  Regencies: Regency[];
  district: District[];
};

export default function FilterPage() {
  const data = useLoaderData() as RegionsData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedProvinceId = searchParams.get('province') || '';
  const selectedRegencyId = searchParams.get('regency') || '';
  const selectedDistrictId = searchParams.get('district') || '';

  // Filter dependent dropdown
  const filteredRegencies = data.Regencies.filter(
    (r) => r.province_id.toString() === selectedProvinceId
  );
  const filteredDistricts = data.district.filter(
    (d) => d.regency_id.toString() === selectedRegencyId
  );

  // Ambil nama untuk ditampilkan di main & breadcrumb
  const provinceName = data.Provinces.find((p) => p.id.toString() === selectedProvinceId)?.name;
  const regencyName = data.Regencies.find((r) => r.id.toString() === selectedRegencyId)?.name;
  const districtName = data.district.find((d) => d.id.toString() === selectedDistrictId)?.name;

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) setSearchParams({ province: value });
    else setSearchParams({});
    setIsMobileMenuOpen(false);
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) setSearchParams({ province: selectedProvinceId, regency: value });
    else setSearchParams({ province: selectedProvinceId });
    setIsMobileMenuOpen(false);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ province: selectedProvinceId, regency: selectedRegencyId, district: value });
    } else {
      setSearchParams({ province: selectedProvinceId, regency: selectedRegencyId });
    }
    setIsMobileMenuOpen(false);
  };

  const handleReset = () => {
    setSearchParams({});
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans text-slate-800">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:relative z-40 md:z-0
        w-75 md:w-75 h-full md:h-auto
        border-r border-slate-200 p-6 flex flex-col gap-8 shrink-0
        bg-white transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Globe2 size={20} />
          </div>
          <h1 className="font-bold text-lg">Frontend Assessment</h1>
        </div>

        <div className="text-xs font-bold text-slate-400 tracking-wider">FILTER WILAYAH</div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">PROVINSI</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Map size={16} />
              </div>
              <select
                name="province"
                value={selectedProvinceId}
                onChange={handleProvinceChange}
                className="border border-slate-300 rounded-lg p-2.5 pl-10 bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer w-full"
              >
                <option value="">Pilih Provinsi</option>
                {data.Provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">KOTA/KABUPATEN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Building2 size={16} />
              </div>
              <select
                name="regency"
                value={selectedRegencyId}
                onChange={handleRegencyChange}
                disabled={!selectedProvinceId}
                className="border border-slate-300 rounded-lg p-2.5 pl-10 bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((reg) => (
                  <option key={reg.id} value={reg.id}>{reg.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">KECAMATAN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <MapPin size={16} />
              </div>
              <select
                name="district"
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                disabled={!selectedRegencyId}
                className="border border-slate-300 rounded-lg p-2.5 pl-10 bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((dist) => (
                  <option key={dist.id} value={dist.id}>{dist.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 border border-blue-500 text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors"
        >
          <FilterX size={16} />
           RESET
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        <header className="border-b border-slate-200 p-4 md:p-6 flex items-center h-16 md:h-20 mt-16 md:mt-0">
          <nav className="breadcrumb text-xs md:text-sm font-semibold flex items-center gap-2 text-slate-400 overflow-x-auto whitespace-nowrap">
            <span className={!provinceName ? "text-blue-500" : ""}>Indonesia</span>
            {provinceName && (
              <><span>›</span><span className={!regencyName ? "text-blue-500" : ""}>{provinceName}</span></>
            )}
            {regencyName && (
              <><span>›</span><span className={!districtName ? "text-blue-500" : ""}>{regencyName}</span></>
            )}
            {districtName && (
              <><span>›</span><span className="text-blue-500">{districtName}</span></>
            )}
          </nav>
        </header>

        <main className="flex-1 bg-slate-50/30 flex flex-col items-center justify-center py-6 md:py-10 gap-4 md:gap-8 px-4">
          {provinceName && (
            <div className="text-center">
              <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">PROVINSI</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">{provinceName}</h2>
            </div>
          )}

          {regencyName && (
            <>
              <div className="text-slate-300 font-light text-xl md:text-2xl">↓</div>
              <div className="text-center">
                <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">KOTA / KABUPATEN</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">{regencyName}</h2>
              </div>
            </>
          )}

          {districtName && (
            <>
              <div className="text-slate-300 font-light text-xl md:text-2xl">↓</div>
              <div className="text-center">
                <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">KECAMATAN</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">{districtName}</h2>
              </div>
            </>
          )}

          {!provinceName && (
            <div className="text-slate-400 font-medium text-sm md:text-base text-center">
              <span className="md:hidden">Tap menu untuk memilih filter wilayah.</span>
              <span className="hidden md:inline">Silakan pilih filter wilayah di sebelah kiri.</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}