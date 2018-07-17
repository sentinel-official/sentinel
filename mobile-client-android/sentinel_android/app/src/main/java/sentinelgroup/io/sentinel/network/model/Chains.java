package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Embedded;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;

@Entity(tableName = "balance_entity", indices = {@Index(value = {"id"}, unique = true)})
public class Chains {
    @PrimaryKey
    private int id = 1;
    @Embedded(prefix = "main_net_")
    private Net main;
    @Embedded(prefix = "test_net_")
    private Net rinkeby;

    public Chains(Net main, Net rinkeby) {
        this.main = main;
        this.rinkeby = rinkeby;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Net getMain() {
        return main;
    }

    public void setMain(Net main) {
        this.main = main;
    }

    public Net getRinkeby() {
        return rinkeby;
    }

    public void setRinkeby(Net rinkeby) {
        this.rinkeby = rinkeby;
    }
}
