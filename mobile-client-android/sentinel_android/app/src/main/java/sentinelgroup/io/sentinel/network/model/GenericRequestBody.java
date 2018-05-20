package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class GenericRequestBody {
    @SerializedName("password")
    private String password = null;
    @SerializedName("account_addr")
    private String accountAddress = null;
    @SerializedName("vpn_addr")
    private String vpnAddress = null;
    @SerializedName("session_name")
    private String sessionName = null;
    @SerializedName("token")
    private String token = null;
    @SerializedName("info")
    private String info = null;
    @SerializedName("payment_type")
    private String paymentType = null;
    @SerializedName("tx_data")
    private String txData = null;
    @SerializedName("net")
    private String net = null;
    @SerializedName("from_addr")
    private String fromAddress = null;
    @SerializedName("amount")
    private String amount = null;
    @SerializedName("session_id")
    private String sessionId = null;

    private GenericRequestBody(GenericRequestBodyBuilder iBuilder) {
        password = iBuilder.password;
        accountAddress = iBuilder.accountAddress;
        vpnAddress = iBuilder.vpnAddress;
        sessionName = iBuilder.sessionName;
        token = iBuilder.token;
        info = iBuilder.info;
        paymentType = iBuilder.paymentType;
        txData = iBuilder.txData;
        net = iBuilder.net;
        fromAddress = iBuilder.fromAddress;
        amount = iBuilder.amount;
        sessionId = iBuilder.sessionId;
    }

    // Getters
    public String getPassword() {
        return password;
    }

    public String getAccountAddress() {
        return accountAddress;
    }

    public String getVpnAddress() {
        return vpnAddress;
    }

    public String getSessionName() {
        return sessionName;
    }

    public String getToken() {
        return token;
    }

    public String getInfo() {
        return info;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public String getTxData() {
        return txData;
    }

    public String getNet() {
        return net;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public String getAmount() {
        return amount;
    }

    public String getSessionId() {
        return sessionId;
    }

    public static class GenericRequestBodyBuilder {
        @SerializedName("password")
        private String password = null;
        @SerializedName("account_addr")
        private String accountAddress = null;
        @SerializedName("vpn_addr")
        private String vpnAddress = null;
        @SerializedName("session_name")
        private String sessionName = null;
        @SerializedName("token")
        private String token = null;
        @SerializedName("info")
        private String info = null;
        @SerializedName("payment_type")
        private String paymentType = null;
        @SerializedName("tx_data")
        private String txData = null;
        @SerializedName("net")
        private String net = null;
        @SerializedName("from_addr")
        private String fromAddress = null;
        @SerializedName("amount")
        private String amount = null;
        @SerializedName("session_id")
        private String sessionId = null;

        public GenericRequestBodyBuilder password(String password) {
            this.password = password;
            return this;
        }

        public GenericRequestBodyBuilder accountAddress(String accountAddress) {
            this.accountAddress = accountAddress;
            return this;
        }

        public GenericRequestBodyBuilder vpnAddress(String vpnAddress) {
            this.vpnAddress = vpnAddress;
            return this;
        }

        public GenericRequestBodyBuilder sessionName(String sessionName) {
            this.sessionName = sessionName;
            return this;
        }

        public GenericRequestBodyBuilder token(String token) {
            this.token = token;
            return this;
        }

        public GenericRequestBodyBuilder info(String info) {
            this.info = info;
            return this;
        }

        public GenericRequestBodyBuilder paymentType(String paymentType) {
            this.paymentType = paymentType;
            return this;
        }

        public GenericRequestBodyBuilder txData(String txData) {
            this.txData = txData;
            return this;
        }

        public GenericRequestBodyBuilder net(String net) {
            this.net = net;
            return this;
        }

        public GenericRequestBodyBuilder fromAddress(String fromAddress) {
            this.fromAddress = fromAddress;
            return this;
        }

        public GenericRequestBodyBuilder amount(String amount) {
            this.amount = amount;
            return this;
        }

        public GenericRequestBodyBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public GenericRequestBody build(){
            return new GenericRequestBody(this);
        }
    }
}