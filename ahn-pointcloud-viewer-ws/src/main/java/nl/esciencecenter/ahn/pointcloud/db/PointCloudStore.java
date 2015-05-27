package nl.esciencecenter.ahn.pointcloud.db;

import nl.esciencecenter.ahn.pointcloud.core.Selection;
import org.skife.jdbi.v2.DBI;
import org.skife.jdbi.v2.Handle;
import org.skife.jdbi.v2.util.LongMapper;

/**
 *
 * Create test PostGIS database with:
 * CREATE ROLE ahn WITH LOGIN PASSWORD '<some password>';
 * CREATE DATABASE ahn WITH OWNER ahn;
 * \c ahn
 * CREATE EXTENSION postgis;
 *
 * CREATE TABLE tiles (filename VARCHAR, geom geometry(POLYGON), points INTEGER, PRIMARY KEY (filename));
 *
 */
public class PointCloudStore {
    private final DBI dbi;
    private int srid;

    public PointCloudStore(DBI dbi, int srid) {
        this.dbi = dbi;
        this.srid = srid;
    }

    /**
     * Retrieve approximate number of points within selection.
     *
     * @param selection Selection in a pointcloud
     * @return number of points
     */
    public long getApproximateNumberOfPoints(Selection selection) {
        TilesDAO tiles = dbi.onDemand(TilesDAO.class);
        long points = tiles.getApproximateNumberOfPoints(
                selection.getLeft(),
                selection.getBottom(),
                selection.getRight(),
                selection.getTop(),
                srid
                );

        // TODO calculate fraction between area of requested selection and area of selected tiles
        // can be used to interpolate a better number of points
        return points;
    }

}