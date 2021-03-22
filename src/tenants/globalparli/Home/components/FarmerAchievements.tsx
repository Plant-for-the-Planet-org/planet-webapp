import React, { ReactElement } from "react";
import FarmerAchievementsData from "./FarmerAchievements.json";
import styles from "./FarmerAchievements.module.scss";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

interface Props {}

function FarmerAchievements({}: Props): ReactElement {
  
  return (
    <section
      className="pt-60 pb-60 section-pattern bg-img"
      style={{
        backgroundImage:
          'url("assets/img/section-pattern/feature-pattern.png")',
      }}
      id="farmerAchievements"
    >
      <div
        className="container"
      >
        <div className="row">
          <div className="col-12">
            <div className="section-title text-center">
              <h3
                style={{
                  fontFamily: "Caveat, cursive",
                  fontWeight: "bolder",
                  letterSpacing: 1.3,
                  fontSize: "36px",
                }}
              >
                Success Stories
              </h3>
              <h2>Farmer Achievements</h2>
              <p style={{ marginTop: "16px" }}>
                By changing the cropping pattern and shifting to Horticulture,
                farmers have multiplied their incomes.
              </p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          {FarmerAchievementsData.map((farmer) => {
            return (
              <div
                key={farmer.id}
                className="col-lg-4 col-md-6"
                style={{ maxWidth: "380px" }}
              >
                <div className="single-feature text-center p-0">
                  <div className={styles.achievementImageContainer}>
                    {/* <img
                      src={farmer.farmImage}
                      data-rjs={2}
                      alt=""
                      data-rjs-processed="true"
                      className={styles.achievementImage}
                    /> */}
                    <Image
                      src={farmer.farmImage}
                      alt={farmer.name}
                      className={styles.achievementImage}
                      height={200}
                      width={350}
                    />
                    <div className={styles.achievementImageOverlay} />
                    <h1 className={styles.farmerName}>{farmer.name}</h1>
                  </div>
                  <div className={`content ${styles.contentContainer}`}>
                    {/* <img
                      src={farmer.farmerImage}
                      className={styles.farmerImage}
                    /> */}
                    <div className={styles.farmerImage}>
                    <Image
                      src={farmer.farmerImage}
                      alt={farmer.name}
                      height={80}
                      width={80}
                    />
                      </div>
                    
                    <h1
                      className={styles.multipliedBy}
                      style={{
                        fontFamily: "Caveat, cursive",
                        fontWeight: "bold",
                        letterSpacing: 1.3,
                        fontSize: "64px",
                      }}
                    >
                      {farmer.multipliedBy}x
                      <p className={styles.multipliedByText}>income</p>
                      <p className={styles.multipliedByText}>increased</p>
                    </h1>

                    <div className={styles.incomeStats}>
                      <h2 className={styles.earlierIncome}>
                        ₹{farmer.earlierIncome}
                      </h2>
                      <div style={{
                          marginLeft: "9px",
                          marginRight: "9px",
                          alignSelf: " center",
                        }}>
                      <Image
                        src={"/assets/img/icons/angle-right.svg"}
                        height={20}
                        width={26}
                        alt="Right arrow"
                        
                      />
                      </div>
                      {/* <img src={"/assets/img/icons/angle-right.svg"} /> */}
                      <h2 className={styles.newIncome}>₹{farmer.newIncome}</h2>
                    </div>
                    <p>Annual Income per acre</p>

                    <h3>
                      <span>{farmer.newCrop}</span> instead of{" "}
                      {farmer.originalCrops[0]}{" "}
                    </h3>

                    {/* <p>from {farmer.location}</p> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FarmerAchievements;
