package co.sentinel.lite.network.model;

import com.google.gson.annotations.SerializedName;

import java.math.BigInteger;

public class GenericRequestBody {
    @SerializedName("password")
    private String password;
    @SerializedName("device_id")
    private String deviceIdMain;
    @SerializedName("deviceId")
    private String deviceIdReferral;
    @SerializedName("account_addr")
    private String accountAddress;
    @SerializedName("vpn_addr")
    private String vpnAddress;
    @SerializedName("session_name")
    private String sessionName;
    @SerializedName("token")
    private String token;
    @SerializedName("info")
    private String info;
    @SerializedName("payment_type")
    private String paymentType;
    @SerializedName("tx_data")
    private String txData;
    @SerializedName("net")
    private String net;
    @SerializedName("from_addr")
    private String fromAddress;
    @SerializedName("amount")
    private BigInteger amount;
    @SerializedName("session_id")
    private String sessionId;
    private String clientAddress;
    private String referredBy;
    private String address;
    private Integer rating;

    private GenericRequestBody(GenericRequestBodyBuilder iBuilder) {
        password = iBuilder.password;
        deviceIdMain = iBuilder.deviceIdMain;
        deviceIdReferral = iBuilder.deviceIdReferral;
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
        clientAddress = iBuilder.clientAddress;
        referredBy = iBuilder.referredBy;
        address = iBuilder.address;
        rating = iBuilder.rating;
    }

    // Getters
    public String getPassword() {
        return password;
    }

    public String getDeviceIdMain() {
        return deviceIdMain;
    }

    public String getDeviceIdReferral() {
        return deviceIdReferral;
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

    public BigInteger getAmount() {
        return amount;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getClientAddress() {
        return clientAddress;
    }

    public String getReferredBy() {
        return referredBy;
    }

    public String getAddress() {
        return address;
    }

    public static class GenericRequestBodyBuilder {
        @SerializedName("password")
        private String password = null;
        @SerializedName("device_id")
        private String deviceIdMain = null;
        @SerializedName("deviceId")
        private String deviceIdReferral = null;
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
        private BigInteger amount = null;
        @SerializedName("session_id")
        private String sessionId = null;
        private String clientAddress = null;
        private String referredBy = null;
        private String address = null;
        private Integer rating;

        public GenericRequestBodyBuilder password(String password) {
            this.password = password;
            return this;
        }

        public GenericRequestBodyBuilder accountAddress(String accountAddress) {
            this.accountAddress = accountAddress;
            return this;
        }

        public GenericRequestBodyBuilder deviceIdMain(String deviceIdMain) {
            this.deviceIdMain = deviceIdMain;
            return this;
        }

        public GenericRequestBodyBuilder deviceIdReferral(String deviceIdReferral) {
            this.deviceIdReferral = deviceIdReferral;
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

        public GenericRequestBodyBuilder amount(BigInteger amount) {
            this.amount = amount;
            return this;
        }

        public GenericRequestBodyBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public GenericRequestBodyBuilder clientAddress(String clientAddress) {
            this.clientAddress = clientAddress;
            return this;
        }

        public GenericRequestBodyBuilder referredBy(String referredBy) {
            this.referredBy = referredBy;
            return this;
        }

        public GenericRequestBodyBuilder address(String address) {
            this.address = address;
            return this;
        }

        public GenericRequestBodyBuilder rating(int rating) {
            this.rating = rating;
            return this;
        }

        public GenericRequestBody build() {
            return new GenericRequestBody(this);
        }
    }

    public enum NetUnit {
        MAIN("main"),
        RINKEBY("rinkeby");

        private String name;

        NetUnit(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return name;
        }
    }

    public enum PaymentType {
        INIT("init"),
        NORMAL("normal");

        private String name;

        PaymentType(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return name;
        }
    }
}