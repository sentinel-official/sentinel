package sentinelgroup.io.sentinel.util;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Conversion functions - Ether, Network Data Rates
 */
public final class Convert {
    private Convert() {
    }

    // Ether conversions
    public static BigDecimal fromWei(String number, EtherUnit etherUnit) {
        return fromWei(new BigDecimal(number), etherUnit);
    }

    public static BigDecimal fromWei(BigDecimal number, EtherUnit etherUnit) {
        return number.divide(etherUnit.getWeiFactor());
    }

    public static BigDecimal toWei(String number, EtherUnit etherUnit) {
        return toWei(new BigDecimal(number), etherUnit);
    }

    public static BigDecimal toWei(BigDecimal number, EtherUnit etherUnit) {
        return number.multiply(etherUnit.getWeiFactor());
    }

    // Network Data conversions
    public static double fromBitsPerSecond(String number, DataUnit dataUnit) {
        return fromBitsPerSecond(String.valueOf(number), dataUnit);
    }

    public static double fromBitsPerSecond(double number, DataUnit dataUnit) {
        return number / dataUnit.getFactor();
    }

    public static double toBitsPerSecond(String number, DataUnit dataUnit) {
        return toBitsPerSecond(String.valueOf(number), dataUnit);
    }

    public static double toBitsPerSecond(double number, DataUnit dataUnit) {
        return number * dataUnit.getFactor();
    }

    public enum EtherUnit {
        WEI("wei", 0),
        KWEI("kwei", 3),
        MWEI("mwei", 6),
        GWEI("gwei", 9),
        SZABO("szabo", 12),
        FINNEY("finney", 15),
        ETHER("ether", 18),
        KETHER("kether", 21),
        METHER("mether", 24),
        GETHER("gether", 27);

        private String name;
        private BigDecimal weiFactor;

        EtherUnit(String name, int factor) {
            this.name = name;
            this.weiFactor = BigDecimal.TEN.pow(factor);
        }

        public BigDecimal getWeiFactor() {
            return weiFactor;
        }

        @Override
        public String toString() {
            return name;
        }

        public static EtherUnit fromString(String name) {
            if (name != null) {
                for (EtherUnit etherUnit : EtherUnit.values()) {
                    if (name.equalsIgnoreCase(etherUnit.name)) {
                        return etherUnit;
                    }
                }
            }
            return EtherUnit.valueOf(name);
        }
    }

    public enum DataUnit {
        BPS("bps", 0),
        KBPS("Kbps", 3),
        MBPS("Mbps", 6),
        GBPS("Gbps", 9),
        TBPS("Tbps", 12);

        private String name;
        private double factor;

        DataUnit(String name, int factor) {
            this.name = name;
            this.factor = Math.pow(10, factor);
        }

        public double getFactor() {
            return factor;
        }

        @Override
        public String toString() {
            return name;
        }

        public static DataUnit fromString(String name) {
            if (name != null) {
                for (DataUnit dataUnit : DataUnit.values()) {
                    if (name.equalsIgnoreCase(dataUnit.name)) {
                        return dataUnit;
                    }
                }
            }
            return DataUnit.valueOf(name);
        }
    }
}