package sentinelgroup.io.sentinel.network.model;

public class OnBoardingInfo {
    public int image1Id;
    public int image2Id;
    public int infoTitle;
    public int infoDesc;

    public OnBoardingInfo(int image1Id, int image2Id, int infoTitle, int infoDesc) {
        this.image1Id = image1Id;
        this.image2Id = image2Id;
        this.infoTitle = infoTitle;
        this.infoDesc = infoDesc;
    }
}
