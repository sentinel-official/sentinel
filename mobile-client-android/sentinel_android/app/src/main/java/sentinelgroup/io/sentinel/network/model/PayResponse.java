package sentinelgroup.io.sentinel.network.model;

public class PayResponse {
    public boolean success;
    public String tx_hash;
    public String message;
    public PayError error;
}
