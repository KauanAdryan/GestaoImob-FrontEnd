import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type ImovelAPI } from '../../services/imovelService';

import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl:     markerShadowUrl,
});

interface GeocodedImovel { imovel: ImovelAPI; lat: number; lng: number }

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (points.length === 0 || fitted.current) return;
    fitted.current = true;
    if (points.length === 1) map.setView(points[0], 13);
    else map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function ImovelMap({ imoveis, isDark, height = 420 }: { imoveis: ImovelAPI[]; isDark: boolean; height?: number }) {
  const [markers, setMarkers] = useState<GeocodedImovel[]>([]);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    // Use stored coordinates directly — no geocoding needed
    const withCoords = imoveis
      .filter(i => i.latitude != null && i.longitude != null)
      .map(i => ({ imovel: i, lat: i.latitude!, lng: i.longitude! }));

    setMarkers(withCoords);
    setReady(true);
  }, [imoveis]);

  const points = markers.map(m => [m.lat, m.lng] as [number, number]);
  const withoutCoords = imoveis.filter(i => i.latitude == null || i.longitude == null);

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      {!ready && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center"
          style={{ background: isDark ? 'rgba(15,18,28,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        </div>
      )}

      {withoutCoords.length > 0 && (
        <p className="text-xs mb-2" style={{ color: 'var(--ailos-cinza-500)' }}>
          {withoutCoords.length} imóvel(eis) sem localização definida não {withoutCoords.length === 1 ? 'aparece' : 'aparecem'} no mapa.
          Edite o cadastro para adicionar o ponto.
        </p>
      )}

      <div className="rounded-xl overflow-hidden border" style={{ border: '1px solid var(--border)' }}>
        <MapContainer
          center={[-15.13, -53.19]}
          zoom={4}
          style={{ height: `${height}px`, width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitBounds points={points} />
          {markers.map(({ imovel, lat, lng }) => {
            const foto = imovel.fotosImovel?.[0];
            const endereco = imovel.enderecoDTO;
            return (
              <Marker
                key={imovel.id}
                position={[lat, lng]}
                eventHandlers={{
                  mouseover: e => e.target.openPopup(),
                  mouseout:  e => e.target.closePopup(),
                }}
              >
                <Popup maxWidth={170} closeButton={false}>
                  <div style={{ width: 158, fontFamily: 'inherit' }}>
                    {foto && (
                      <img
                        src={foto}
                        alt="foto"
                        style={{ width: '100%', height: 76, objectFit: 'cover', display: 'block', marginBottom: 6, borderRadius: 3 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 2, color: '#111' }}>
                      {imovel.tipoImovel}
                    </p>
                    {endereco && (
                      <p style={{ fontSize: 10, color: '#666', marginBottom: 4, lineHeight: 1.4 }}>
                        {endereco.ruaNome}{endereco.numero ? `, ${endereco.numero}` : ''}{'\n'}
                        {endereco.cidadeNome} — {endereco.estadoSigla}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 700, fontSize: 11, color: '#165C7D' }}>
                        R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                      </p>
                      {imovel.area && (
                        <p style={{ fontSize: 10, color: '#999' }}>{imovel.area} m²</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
