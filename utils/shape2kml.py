import os
import geopandas as gpd

shapeFolder = '/Users/velascod/Desktop/earthquake-viwer/public/files/Fwd archivo para visualizar en mapa/FallasBC_locales/'

gpd.io.file.fiona.drvsupport.supported_drivers['KML'] = 'rw'

for shapefile in os.listdir(shapeFolder):
    if shapefile.endswith('.shp'):
        read_shp = gpd.read_file(shapeFolder + shapefile)
        read_shp.to_file(shapeFolder + shapefile[:-4] + '.kml', driver='KML')