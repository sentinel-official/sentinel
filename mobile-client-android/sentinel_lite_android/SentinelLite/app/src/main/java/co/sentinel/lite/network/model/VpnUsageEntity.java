package co.sentinel.lite.network.model;

import android.arch.persistence.room.Embedded;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Ignore;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.arch.persistence.room.TypeConverters;

import java.util.ArrayList;
import java.util.List;

import co.sentinel.lite.db.typeconverters.SessionListTypeConverter;

@Entity(tableName = "vpn_usage_entity", indices = {@Index(value = {"id"}, unique = true)})
public class VpnUsageEntity {
    @PrimaryKey
    private int id = 1;
    private long due;
    @Embedded(prefix = "stats_")
    private Stats stats;
    @TypeConverters(SessionListTypeConverter.class)
    private List<Session> sessions = new ArrayList<>();
    // To getGenericWebService current usage
    @Ignore
    public long down;
    @Ignore
    public long up;

    public VpnUsageEntity(long due, Stats stats, List<Session> sessions) {
        this.due = due;
        this.stats = stats;
        this.sessions.addAll(sessions);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getDue() {
        return due;
    }

    public void setDue(long due) {
        this.due = due;
    }

    public Stats getStats() {
        return stats;
    }

    public void setStats(Stats stats) {
        this.stats = stats;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}
