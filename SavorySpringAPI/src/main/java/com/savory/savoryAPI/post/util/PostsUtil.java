//// package com.credera.hero.util;
//
//// import com.credera.hero.dto.SuperHeroDto;
//// import com.credera.hero.entity.SuperHero;
//// import com.credera.power.util.SuperPowerUtil;
//
//// import java.util.stream.Collectors;
//
//// public class SuperHeroUtil {
//
////     public static SuperHeroDto buildSuperHeroDto(SuperHero superHero) {
////         return SuperHeroDto.builder()
////                 .imageUrl(superHero.getImageUrl())
////                 .name(superHero.getName())
////                 .key(superHero.getKey())
////                 .originStory(superHero.getOriginStory())
////                 .superPowers(superHero.getSuperPowers().stream().map(SuperPowerUtil::buildSuperPowerDto).collect(Collectors.toList()))
////                 .build();
////     }
//// }
//
package com.savory.savoryAPI.post.util;
import com.savory.savoryAPI.post.dto.PostsUsernameDto;
import com.savory.savoryAPI.post.entity.Posts;
import com.savory.savoryAPI.post.dto.PostsDto;
import com.savory.savoryAPI.post.entity.PostsUsername;

// public class PostsDto {
//     int id;
//     int userID;
//     string headline;
//     List<String>ingredients;
//     List<String>recipe;
//     String pictureURL;
//     String tag1;
//     String tag2;
//     String date;


// }

public class PostsUtil
{
   public static PostsDto buildPostDto(Posts post)
   {
       return PostsDto.builder()
       .postId(post.getPostId())
       .userID(post.getUserID())
       .headline(post.getHeadline())
       .ingredients(post.getIngredients())
       .recipe(post.getRecipe())
       .img(post.getImg())
       .tags(post.getTags())
       .build();
   }

    public static PostsUsernameDto buildPostUsernameDto(PostsUsername post)
    {
        return PostsUsernameDto.builder()
                .postId(post.getPostId())
                .userID(post.getUserID())
                .headline(post.getHeadline())
                .ingredients(post.getIngredients())
                .recipe(post.getRecipe())
                .img(post.getImg())
                .tags(post.getTags())
                .username(post.getUsername())
                .build();
    }



}