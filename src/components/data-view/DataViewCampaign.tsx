import { useCampaign } from "../../contexts/campaign-context";

const DataViewCampaign = () => {
  const { allCampaigns } = useCampaign();

  return (
    <div>
      {allCampaigns.map((c, index) => (
        <div key={index}>
          <p>{c.deadline}</p>
          <p>{c.goal}</p>
          <p>{c.totalContributed}</p>
        </div>
      ))}
    </div>
  );
};

export default DataViewCampaign;