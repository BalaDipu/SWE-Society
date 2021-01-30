import { Box, Grid, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Layout from "../components/generic/layout";
import axios from "axios";
import ProfileBasics from "../components/profile/basics";
import Skills from "../components/profile/skills";
import Education from "../components/profile/education";
import Work from "../components/profile/work";
import LoadingPage from "../components/generic/loadingPage";
import LoadingSkeleton from "../components/profile/skeleton";

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [requestState, setRequestState] = useState("loading");

  useEffect(() => {
    axios.get("/api/user/me").then((res) => {
      setUser(res.data.user);
      console.log(res.data.user);
      setRequestState("loaded");
    });
  }, []);

  if (requestState === "loading") return <LoadingSkeleton />;
  else
    return (
      <Layout>
        <Grid
          templateColumns={["1fr", "1fr", "1fr 2fr", "1fr 3fr", "1fr 3fr"]}
          gap={4}
          p={3}
        >
          <ProfileBasics user={user} />
          <Box>
            {user.skills.length > 0 && <Skills skills={user.skills} />}
            {user.education.length > 0 && (
              <Education education={user.education} />
            )}
            {user.workExperiences.length > 0 && (
              <Work works={user.workExperiences} />
            )}
          </Box>
        </Grid>
      </Layout>
    );
};

export default Profile;